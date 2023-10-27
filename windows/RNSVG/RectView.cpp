#include "pch.h"
#include "RectView.h"
#if __has_include("RectView.g.cpp")
#include "RectView.g.cpp"
#endif

#include "JSValueXaml.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void RectView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "width") {
      m_width = SVGLength::From(propertyValue);
    } else if (propertyName == "height") {
      m_height = SVGLength::From(propertyValue);
    } else if (propertyName == "x") {
      m_x = SVGLength::From(propertyValue);
    } else if (propertyName == "y") {
      m_y = SVGLength::From(propertyValue);
    } else if (propertyName == "rx") {
      m_rx = SVGLength::From(propertyValue);
    } else if (propertyName == "ry") {
      m_ry = SVGLength::From(propertyValue);
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}

void RectView::CreateGeometry() {
  auto const &root{SvgRoot()};

  float x{Utils::GetAbsoluteLength(m_x, root.ActualWidth())};
  float y{Utils::GetAbsoluteLength(m_y, root.ActualHeight())};
  float width{Utils::GetAbsoluteLength(m_width, root.ActualWidth())};
  float height{Utils::GetAbsoluteLength(m_height, root.ActualHeight())};

  auto const rxLength{m_rx.Unit() == RNSVG::LengthType::Unknown ? m_ry : m_rx};
  auto const ryLength{m_ry.Unit() == RNSVG::LengthType::Unknown ? m_rx : m_ry};
  float rx{Utils::GetAbsoluteLength(rxLength, root.ActualWidth())};
  float ry{Utils::GetAbsoluteLength(ryLength, root.ActualHeight())};

  com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(root.DeviceContext())->Get()};

  com_ptr<ID2D1Factory> factory;
  deviceContext->GetFactory(factory.put());

  com_ptr<ID2D1RoundedRectangleGeometry> geometry;
  check_hresult(factory->CreateRoundedRectangleGeometry(
      D2D1::RoundedRect(D2D1::RectF(x, y, width + x, height + y), rx, ry), geometry.put()));

  Geometry(make<RNSVG::implementation::D2DGeometry>(geometry.as<ID2D1Geometry>()));
}
} // namespace winrt::RNSVG::implementation
