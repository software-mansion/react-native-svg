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
