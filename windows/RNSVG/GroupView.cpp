#include "pch.h"

#include "JSValueXaml.h"

#include "GroupView.h"
#if __has_include("GroupView.g.cpp")
#include "GroupView.g.cpp"
#endif

#include "SVGLength.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void GroupView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  auto const &parent{SvgParent().try_as<RNSVG::GroupView>()};
  auto fontProp{RNSVG::FontProp::Unknown};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "font") {
      auto const &font{propertyValue.AsObject()};

      // When any of the font props update, you don't get individual updates.
      // Instead, you get a new JSValueObject with all font props set on the element.
      // If a prop was removed, you will not get a null type - it just won't
      // be part of the new prop object, so we will reset all font values.
      if (forceUpdate) {
        m_fontPropMap[RNSVG::FontProp::FontSize] = false;
        m_fontPropMap[RNSVG::FontProp::FontFamily] = false;
        m_fontPropMap[RNSVG::FontProp::FontWeight] = false;
      }

      for (auto const &item : m_fontPropMap) {
        if (!item.second) {
          switch (item.first) {
            case RNSVG::FontProp::FontSize:
              m_fontSize = parent ? parent.FontSize() : 12.0f;
              break;
            case RNSVG::FontProp::FontFamily:
              m_fontFamily = parent ? parent.FontFamily() : L"Segoe UI";
              break;
            case RNSVG::FontProp::FontWeight:
              m_fontWeight = L"auto";
              break;
            default:
              throw hresult_error();
          }
        }
      }

      for (auto const &prop : font) {
        auto const &key{prop.first};
        auto const &value{prop.second};

        if (key == "fontSize") {
          fontProp = RNSVG::FontProp::FontSize;
          if (forceUpdate || !m_fontPropMap[fontProp]) {
            m_fontSize = value.AsSingle();
          }
        } else if (key == "fontFamily") {
          fontProp = RNSVG::FontProp::FontFamily;
          if (forceUpdate || !m_fontPropMap[fontProp]) {
            m_fontFamily = to_hstring(value.AsString());
          }
        } else if (key == "fontWeight") {
          fontProp = RNSVG::FontProp::FontWeight;
          auto fontWeight{to_hstring(value.AsString())};
          if (forceUpdate) {
            m_fontWeight = fontWeight;
          } else if (!m_fontPropMap[fontProp]) {
            m_fontWeight = L"auto";
          }
        }

        // forceUpdate = true means the property is being set on an element
        // instead of being inherited from the parent.
        if (forceUpdate && (fontProp != RNSVG::FontProp::Unknown)) {
          // If the propertyValue is null, that means we reset the property
          m_fontPropMap[fontProp] = true;
        }
      }
    }
  }

  __super::UpdateProperties(reader, forceUpdate, false);

  for (auto const &child : Children()) {
    child.UpdateProperties(reader, false, false);
  }

  if (invalidate && SvgParent()) {
    SvgRoot().InvalidateCanvas();
  }
}

void GroupView::CreateGeometry(UI::Xaml::CanvasControl const &canvas) {
  auto const &resourceCreator{canvas.try_as<ICanvasResourceCreator>()};
  std::vector<Geometry::CanvasGeometry> geometries;
  for (auto const &child : Children()) {
    if (!child.Geometry()) {
      child.CreateGeometry(canvas);
    }
    geometries.push_back(child.Geometry());
  }

  Geometry(Geometry::CanvasGeometry::CreateGroup(resourceCreator, geometries, FillRule()));
}

void GroupView::SaveDefinition() {
  __super::SaveDefinition();

  for (auto const &child : Children()) {
    child.SaveDefinition();
  }
}

void GroupView::MergeProperties(RNSVG::RenderableView const &other) {
  __super::MergeProperties(other);

  for (auto const &child : Children()) {
    child.MergeProperties(*this);
  }
}

void GroupView::Render(UI::Xaml::CanvasControl const &canvas, CanvasDrawingSession const &session) {
  auto const &transform{session.Transform()};

  if (m_propSetMap[RNSVG::BaseProp::Matrix]) {
    session.Transform(transform * SvgTransform());
  }

  auto const &clipPathGeometry{ClipPathGeometry()};

  if (auto const &opacityLayer{clipPathGeometry ? session.CreateLayer(m_opacity, clipPathGeometry) : session.CreateLayer(m_opacity)}) {
    if (Children().Size() == 0) {
      __super::Render(canvas, session);
    } else {
      RenderGroup(canvas, session);
    }

    opacityLayer.Close();
  }
  session.Transform(transform);
}

void GroupView::RenderGroup(UI::Xaml::CanvasControl const &canvas, CanvasDrawingSession const &session) {
  for (auto const &child : Children()) {
    child.Render(canvas, session);
  }
}

void GroupView::CreateResources(ICanvasResourceCreator const &resourceCreator, UI::CanvasCreateResourcesEventArgs const &args) {
  for (auto const &child : Children()) {
    child.CreateResources(resourceCreator, args);
  }
}

void GroupView::Unload() {
  for (auto const &child : Children()) {
    child.Unload();
  }

  m_reactContext = nullptr;
  m_fontPropMap.clear();
  m_children.Clear();

  __super::Unload();
}

winrt::RNSVG::IRenderable GroupView::HitTest(Windows::Foundation::Point const &point) {
  RNSVG::IRenderable renderable{nullptr};
  if (IsResponsible()) {
    for (auto const &child : Children()) {
      if (auto const &hit{child.HitTest(point)}) {
        renderable = hit;
      }
    }
    if (renderable && !renderable.IsResponsible()) {
      return *this;
    } else if (!renderable){
      if (!Geometry()) {
        if (auto const &svgRoot{SvgRoot()}) {
          CreateGeometry(svgRoot.Canvas());
        }
      }
      if (Geometry()) {
        auto const &bounds{Geometry().ComputeBounds()};
        if (Windows::UI::Xaml::RectHelper::Contains(bounds, point)) {
          return *this;
        }
      }
    }
  }
  return renderable;
}
} // namespace winrt::RNSVG::implementation
