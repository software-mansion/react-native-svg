#include "pch.h"
#include "EllipseView.h"
#include "EllipseView.g.cpp"

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
      m_cx = SVGLength::From(propertyValue);
    } else if (propertyName == "cy") {
      m_cy = SVGLength::From(propertyValue);
    } else if (propertyName == "rx") {
      m_rx = SVGLength::From(propertyValue);
    } else if (propertyName == "ry") {
      m_ry = SVGLength::From(propertyValue);
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}

void EllipseView::CreateGeometry() {
  auto const root{SvgRoot()};

  float cx{Utils::GetAbsoluteLength(m_cx, root.ActualWidth())};
  float cy{Utils::GetAbsoluteLength(m_cy, root.ActualHeight())};
  float rx{Utils::GetAbsoluteLength(m_rx, root.ActualWidth())};
  float ry{Utils::GetAbsoluteLength(m_ry, root.ActualHeight())};

  com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(root.DeviceContext())->Get()};

  com_ptr<ID2D1Factory> factory;
  deviceContext->GetFactory(factory.put());

  com_ptr<ID2D1EllipseGeometry> geometry;
  check_hresult(factory->CreateEllipseGeometry(D2D1::Ellipse({cx, cy}, rx, ry), geometry.put()));

  Geometry(make<RNSVG::implementation::D2DGeometry>(geometry.as<ID2D1Geometry>()));
}
} // namespace winrt::RNSVG::implementation
