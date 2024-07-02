#include "pch.h"

#include "JSValueXaml.h"

#include "GroupView.h"
#if __has_include("GroupView.g.cpp")
#include "GroupView.g.cpp"
#endif

#include "SVGLength.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
#ifdef USE_FABRIC
SvgGroupCommonProps::SvgGroupCommonProps(
    const winrt::Microsoft::ReactNative::ViewProps &props)
    : base_type(props) {}

void SvgGroupCommonProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

GroupView::GroupView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args)
    : base_type(args), m_reactContext(args.ReactContext()) {}

void GroupView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  builder.AddViewComponent(
      L"RNSVGGroup", [](winrt::Microsoft::ReactNative::IReactViewComponentBuilder const &builder) noexcept {
        builder.SetCreateProps([](winrt::Microsoft::ReactNative::ViewProps props) noexcept {
          return winrt::make<winrt::RNSVG::implementation::SvgGroupCommonProps>(props);
        });
        builder.SetCreateComponentView(
        [](const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) noexcept {
          return winrt::make<winrt::RNSVG::implementation::GroupView>(args);
        });
      });
}

void GroupView::UpdateProperties(
    const winrt::Microsoft::ReactNative::IComponentProps &props,
    const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
    bool forceUpdate,
    bool invalidate) noexcept {
  auto groupProps = props.as<SvgGroupCommonProps>();
  auto oldGroupProps = oldProps ? oldProps.as<SvgGroupCommonProps>() : nullptr;

  auto const &parent{Parent().try_as<RNSVG::GroupView>()};

  if (!oldGroupProps || groupProps->font != oldGroupProps->font) {
    if (forceUpdate || !m_fontPropMap[RNSVG::FontProp::FontSize]) {
      if (groupProps->font.fontSize) {
        m_fontSize = groupProps->font.fontSize != std::nullopt
            ? *groupProps->font.fontSize
            : (parent ? parent.FontSize() : 12.0f);
      }

      m_fontPropMap[RNSVG::FontProp::FontSize] = !!groupProps->font.fontSize;
    }

    if (forceUpdate || !m_fontPropMap[RNSVG::FontProp::FontFamily]) {
      if (groupProps->font.fontFamily) {
        m_fontFamily = !(*groupProps->font.fontFamily).empty()
            ? winrt::to_hstring(*groupProps->font.fontFamily)
            : (parent ? parent.FontFamily() : L"Segoe UI");

        m_fontPropMap[RNSVG::FontProp::FontFamily] = !(*groupProps->font.fontFamily).empty();
      }
    }

    if (forceUpdate || !m_fontPropMap[RNSVG::FontProp::FontWeight]) {
      if (groupProps->font.fontWeight) {
        m_fontWeight = !(*groupProps->font.fontWeight).empty()
            ? winrt::to_hstring(*groupProps->font.fontWeight)
            : (parent ? parent.FontWeight() : L"auto");

        m_fontPropMap[RNSVG::FontProp::FontWeight] = !(*groupProps->font.fontWeight).empty();
      }
    }
  }

  base_type::UpdateProperties(props, oldProps, forceUpdate, false);

  for (auto const &child : Children()) {
    child.as<IRenderableFabric>().UpdateProperties(props, oldProps, false, false);
  }

  if (invalidate && Parent()) {
    SvgRoot().Invalidate();
  }
}
#else
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
    child.as<IRenderablePaper>().UpdateProperties(reader, false, false);
  }

  if (invalidate && SvgParent()) {
    SvgRoot().Invalidate();
  }
}
#endif

void GroupView::CreateGeometry(RNSVG::D2DDeviceContext const &context) {
  std::vector<ID2D1Geometry *> geometries;
  for (auto const childComponent : Children()) {
    auto const child = childComponent.as<IRenderable>();
    if (!child.Geometry()) {
      child.CreateGeometry(context);
    }

    if (child.Geometry()) {
      com_ptr<ID2D1Geometry> geometry{get_self<D2DGeometry>(child.Geometry())->Get()};

      // This takes advantage of the fact that geometry elements are alive for
      // the duration of this method and so are their D2D resources.
      geometries.emplace_back(geometry.get());
    }
  }

  if (!geometries.empty()) {
    com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(context)->Get()};

    com_ptr<ID2D1Factory> factory;
    deviceContext->GetFactory(factory.put());

    com_ptr<ID2D1GeometryGroup> group;
    check_hresult(factory->CreateGeometryGroup(
        D2DHelpers::GetFillRule(FillRule()), &geometries[0], static_cast<uint32_t>(geometries.size()), group.put()));

    Geometry(make<RNSVG::implementation::D2DGeometry>(group.as<ID2D1Geometry>()));
  }
}

void GroupView::SaveDefinition() {
  __super::SaveDefinition();

  for (auto const &child : Children()) {
    child.as<IRenderable>().SaveDefinition();
  }
}

void GroupView::MergeProperties(RNSVG::IRenderable const &other) {
  __super::MergeProperties(other);

  for (auto const &child : Children()) {
    child.as<IRenderable>().MergeProperties(*this);
  }
}

void GroupView::Draw(RNSVG::D2DDeviceContext const &context, Size const &size) {
  com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(context)->Get()};

  D2D1_MATRIX_3X2_F transform{D2DHelpers::GetTransform(deviceContext.get())};

  if (m_propSetMap[RNSVG::BaseProp::Matrix]) {
    deviceContext->SetTransform(D2DHelpers::AsD2DTransform(SvgTransform()) * transform);
  }

  com_ptr<ID2D1Geometry> clipPathGeometry;

  if (ClipPathGeometry(context)) {
    clipPathGeometry = get_self<D2DGeometry>(ClipPathGeometry(context))->Get();
  }

  D2DHelpers::PushOpacityLayer(deviceContext.get(), clipPathGeometry.get(), m_opacity);

  if (Children().Size() == 0) {
    __super::Draw(context, size);
  } else {
    DrawGroup(context, size);
  }

  deviceContext->PopLayer();

  deviceContext->SetTransform(transform);
}

void GroupView::DrawGroup(RNSVG::D2DDeviceContext const &context, Size const &size) {
  for (auto const &child : Children()) {
    child.as<IRenderable>().Draw(context, size);
  }
}

void GroupView::CreateResources() {
  for (auto const &child : Children()) {
    child.as<IRenderable>().CreateResources();
  }
}

void GroupView::Unload() {
  for (auto const &child : Children()) {
    child.as<IRenderable>().Unload();
  }

  m_reactContext = nullptr;
  m_fontPropMap.clear();

#ifndef USE_FABRIC
  m_children.Clear();
#endif

  __super::Unload();
}

winrt::RNSVG::IRenderable GroupView::HitTest(Point const &point) {
  RNSVG::IRenderable renderable{nullptr};
  if (IsResponsible()) {
    for (auto const &child : Children()) {
      if (auto const &hit{child.as<IRenderable>().HitTest(point)}) {
        renderable = hit;
      }
    }
    if (renderable && !renderable.IsResponsible()) {
      return *this;
    } else if (!renderable) {
      if (Geometry()) {
        com_ptr<ID2D1Geometry> geometry{get_self<D2DGeometry>(Geometry())->Get()};

        D2D1_RECT_F bounds;
        check_hresult(geometry->GetBounds(nullptr, &bounds));

        if (xaml::RectHelper::Contains(D2DHelpers::FromD2DRect(bounds), point)) {
          return *this;
        }
      }
    }
  }
  return renderable;
}
} // namespace winrt::RNSVG::implementation
