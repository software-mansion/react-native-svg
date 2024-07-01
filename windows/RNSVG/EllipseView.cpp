#include "pch.h"
#include "EllipseView.h"
#if __has_include("EllipseView.g.cpp")
#include "EllipseView.g.cpp"
#endif

#include "JSValueXaml.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
#ifdef USE_FABRIC
EllipseProps::EllipseProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void EllipseProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

EllipseView::EllipseView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) : base_type(args) {}

void EllipseView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  builder.AddViewComponent(
      L"RNSVGEllipse", [](winrt::Microsoft::ReactNative::IReactViewComponentBuilder const &builder) noexcept {
        builder.SetCreateProps([](winrt::Microsoft::ReactNative::ViewProps props) noexcept {
          return winrt::make<winrt::RNSVG::implementation::EllipseProps>(props);
        });
        builder.SetCreateComponentView([](const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) noexcept {
          return winrt::make<winrt::RNSVG::implementation::EllipseView>(args);
        });
      });
}

void EllipseView::UpdateProperties(
    const winrt::Microsoft::ReactNative::IComponentProps &props,
    const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
    bool forceUpdate,
    bool invalidate) noexcept {
  auto ellipseProps = props.try_as<EllipseProps>();
  if (ellipseProps) {
    m_props = ellipseProps;

    m_cx = m_props->cx;
    m_cy = m_props->cy;
    m_rx = m_props->rx;
    m_ry = m_props->ry;
  }

  base_type::UpdateProperties(props, oldProps, forceUpdate, invalidate);
}
#else
void EllipseView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "cx") {
      m_cx = propertyValue.To<RNSVG::SVGLength>();
    } else if (propertyName == "cy") {
      m_cy = propertyValue.To<RNSVG::SVGLength>();
    } else if (propertyName == "rx") {
      m_rx = propertyValue.To<RNSVG::SVGLength>();
    } else if (propertyName == "ry") {
      m_ry = propertyValue.To<RNSVG::SVGLength>();
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}
#endif

void EllipseView::CreateGeometry(RNSVG::D2DDeviceContext const &context) {
  auto const root{SvgRoot()};

  float width{root.CanvasSize().Width};
  float height{root.CanvasSize().Height};

  float cx{Utils::GetAbsoluteLength(m_cx, width)};
  float cy{Utils::GetAbsoluteLength(m_cy, height)};
  float rx{Utils::GetAbsoluteLength(m_rx, width)};
  float ry{Utils::GetAbsoluteLength(m_ry, height)};

  com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(context)->Get()};

  com_ptr<ID2D1Factory> factory;
  deviceContext->GetFactory(factory.put());

  com_ptr<ID2D1EllipseGeometry> geometry;
  check_hresult(factory->CreateEllipseGeometry(D2D1::Ellipse({cx, cy}, rx, ry), geometry.put()));

  Geometry(make<RNSVG::implementation::D2DGeometry>(geometry.as<ID2D1Geometry>()));
}
} // namespace winrt::RNSVG::implementation
