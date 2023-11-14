#include "pch.h"
#include "CircleView.h"
#include "CircleView.g.cpp"

#include "JSValueXaml.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void CircleView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "r") {
      m_r = SVGLength::From(propertyValue);
    } else if (propertyName == "cx") {
      m_cx = SVGLength::From(propertyValue);
    } else if (propertyName == "cy") {
      m_cy = SVGLength::From(propertyValue);
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}

void CircleView::CreateGeometry() {
  auto const root{SvgRoot()};
  
  float cx{Utils::GetAbsoluteLength(m_cx, root.ActualWidth())};
  float cy{Utils::GetAbsoluteLength(m_cy, root.ActualHeight())};
  float r{Utils::GetAbsoluteLength(m_r, Utils::GetCanvasDiagonal(root.ActualSize()))};

  com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(root.DeviceContext())->Get()};

  com_ptr<ID2D1Factory> factory;
  deviceContext->GetFactory(factory.put());

  com_ptr<ID2D1EllipseGeometry> geometry;
  check_hresult(factory->CreateEllipseGeometry(D2D1::Ellipse({cx, cy}, r, r), geometry.put()));

  Geometry(make<RNSVG::implementation::D2DGeometry>(geometry.as<ID2D1Geometry>()));
}
} // namespace winrt::RNSVG::implementation
