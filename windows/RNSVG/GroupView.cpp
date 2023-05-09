#include "pch.h"

#include "JSValueXaml.h"

#include "GroupView.h"
#if __has_include("GroupView.g.cpp")
#include "GroupView.g.cpp"
#endif

#include "SVGLength.h"
#include "Utils.h"
#include "D2DHelpers.h"

namespace winrt::RNSVG::implementation {
void GroupView::UpdateProperties(
    Microsoft::ReactNative::IJSValueReader const &reader,
    bool forceUpdate,
    bool invalidate) {
  const Microsoft::ReactNative::JSValueObject &propertyMap{
      Microsoft::ReactNative::JSValue::ReadObjectFrom(reader)};

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
    SvgRoot().Invalidate();
  }
}

void GroupView::CreateGeometry() {
  if (auto const &root{SvgRoot()}) {
    std::vector<ID2D1Geometry *> geometries(Children().Size());
    IInspectable asInspectable{nullptr};

    if (geometries.size() > 0) {
      for (uint32_t i = 0; i < Children().Size(); ++i) {
        auto child{Children().GetAt(i)};
        if (!child.Geometry()) {
          child.CreateGeometry();
        }

        com_ptr<ID2D1Geometry> geometry;
        copy_to_abi(child.Geometry(), *geometry.put_void());
        geometries[i] = geometry.get();
      }

      com_ptr<ID2D1DeviceContext1> deviceContext;
      copy_to_abi(root.DeviceContext(), *deviceContext.put_void());

      com_ptr<ID2D1Factory> factory;
      deviceContext->GetFactory(factory.put());

      com_ptr<ID2D1GeometryGroup> group;
      check_hresult(factory->CreateGeometryGroup(
          D2DHelpers::GetFillRule(FillRule()), &geometries[0], static_cast<uint32_t>(geometries.size()), group.put()));

      copy_from_abi(asInspectable, group.get());
    }

    Geometry(asInspectable);
  }
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

void GroupView::Draw(IInspectable const &context, Size size) {
  com_ptr<ID2D1DeviceContext1> deviceContext;
  copy_to_abi(context, *deviceContext.put_void());

  D2D1_MATRIX_3X2_F transform{D2DHelpers::GetTransform(deviceContext.get())};

  if (m_propSetMap[RNSVG::BaseProp::Matrix]) {
    deviceContext->SetTransform(transform * D2DHelpers::AsD2DTransform(SvgTransform()));
  }

  com_ptr<ID2D1Geometry> clipPathGeometry;
  copy_to_abi(ClipPathGeometry(), *clipPathGeometry.put_void());

  D2DHelpers::PushOpacityLayer(deviceContext.get(), clipPathGeometry.get(), m_opacity);

  if (Children().Size() == 0) {
    __super::Draw(context, size);
  } else {
    DrawGroup(context, size);
  }

  deviceContext->PopLayer();

  deviceContext->SetTransform(transform);
}

void GroupView::DrawGroup(IInspectable const &context, Size size) {
  for (auto const &child : Children()) {
    child.Draw(context, size);
  }
}

void GroupView::CreateResources() {
  for (auto const &child : Children()) {
    child.CreateResources();
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

winrt::RNSVG::IRenderable GroupView::HitTest(Point const &point) {
  RNSVG::IRenderable renderable{nullptr};
  if (IsResponsible()) {
    for (auto const &child : Children()) {
      if (auto const &hit{child.HitTest(point)}) {
        renderable = hit;
      }
    }
    if (renderable && !renderable.IsResponsible()) {
      renderable = *this;
    } else if (!renderable){
      if (!Geometry()) {
        CreateGeometry();
      }
      if (Geometry()) {
        com_ptr<ID2D1Geometry> geometry;
        copy_to_abi(Geometry(), *geometry.put_void());

        D2D1_RECT_F bounds;
        check_hresult(geometry->GetBounds(nullptr, &bounds));


        if (xaml::RectHelper::Contains(D2DHelpers::FromD2DRect(bounds), point)) {
          renderable = *this;
        }
      }
    }
  }
  return renderable;
}
} // namespace winrt::RNSVG::implementation
