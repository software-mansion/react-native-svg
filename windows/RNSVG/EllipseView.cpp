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
