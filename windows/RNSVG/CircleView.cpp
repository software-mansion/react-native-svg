#include "pch.h"
#include "CircleView.h"
#if __has_include("CircleView.g.cpp")
#include "CircleView.g.cpp"
#endif

#include "JSValueXaml.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
CircleProps::CircleProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void CircleProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

CircleView::CircleView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) : base_type(args) {}

void CircleView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  builder.AddViewComponent(
      L"RNSVGCircle", [](winrt::Microsoft::ReactNative::IReactViewComponentBuilder const &builder) noexcept {
        builder.SetCreateProps([](winrt::Microsoft::ReactNative::ViewProps props) noexcept {
          return winrt::make<winrt::RNSVG::implementation::CircleProps>(props);
        });
        builder.SetCreateComponentView([](const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) noexcept {
          return winrt::make<winrt::RNSVG::implementation::CircleView>(args);
        });
      });
}

void CircleView::UpdateProperties(
    const winrt::Microsoft::ReactNative::IComponentProps &props,
    const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
    bool forceUpdate,
    bool invalidate) noexcept {
  auto circleProps = props.try_as<CircleProps>();
  if (circleProps) {
    m_props = circleProps;

    m_cx = m_props->cx;
    m_cy = m_props->cy;
    m_r = m_props->r;
  }

  base_type::UpdateProperties(props, oldProps, forceUpdate, invalidate);
}
#else
void CircleView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "r") {
      m_r = propertyValue.To<RNSVG::SVGLength>();
    } else if (propertyName == "cx") {
      m_cx = propertyValue.To<RNSVG::SVGLength>();
    } else if (propertyName == "cy") {
      m_cy = propertyValue.To<RNSVG::SVGLength>();
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}
#endif

void CircleView::CreateGeometry(RNSVG::D2DDeviceContext const &context) {
  auto const root{SvgRoot()};

  float width{root.CanvasSize().Width};
  float height{root.CanvasSize().Height};

  float cx{Utils::GetAbsoluteLength(m_cx, width)};
  float cy{Utils::GetAbsoluteLength(m_cy, height)};
  float r{Utils::GetAbsoluteLength(m_r, Utils::GetCanvasDiagonal(root.CanvasSize()))};

  com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(context)->Get()};

  com_ptr<ID2D1Factory> factory;
  deviceContext->GetFactory(factory.put());

  com_ptr<ID2D1EllipseGeometry> geometry;
  check_hresult(factory->CreateEllipseGeometry(D2D1::Ellipse({cx, cy}, r, r), geometry.put()));

  Geometry(make<RNSVG::implementation::D2DGeometry>(geometry.as<ID2D1Geometry>()));
}
} // namespace winrt::RNSVG::implementation
