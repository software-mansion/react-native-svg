#include "pch.h"
#include "LineView.h"
#if __has_include("LineView.g.cpp")
#include "LineView.g.cpp"
#endif

#include "JSValueXaml.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {

void LineView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "x1") {
      m_x1 = propertyValue.To<RNSVG::SVGLength>();
    } else if (propertyName == "y1") {
      m_y1 = propertyValue.To<RNSVG::SVGLength>();
    } else if (propertyName == "x2") {
      m_x2 = propertyValue.To<RNSVG::SVGLength>();
    } else if (propertyName == "y2") {
      m_y2 = propertyValue.To<RNSVG::SVGLength>();
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}

void LineView::CreateGeometry(RNSVG::D2DDeviceContext const &context) {
  auto const &root{SvgRoot()};

  float width{root.CanvasSize().Width};
  float height{root.CanvasSize().Height};

  float x1{Utils::GetAbsoluteLength(m_x1, width)};
  float y1{Utils::GetAbsoluteLength(m_y1, height)};
  float x2{Utils::GetAbsoluteLength(m_x2, width)};
  float y2{Utils::GetAbsoluteLength(m_y2, height)};

  com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(context)->Get()};

  com_ptr<ID2D1Factory> factory;
  deviceContext->GetFactory(factory.put());

  com_ptr<ID2D1PathGeometry> geometry;
  check_hresult(factory->CreatePathGeometry(geometry.put()));

  com_ptr<ID2D1GeometrySink> sink;
  check_hresult(geometry->Open(sink.put()));

  sink->BeginFigure({x1, y1}, D2D1_FIGURE_BEGIN_FILLED);
  sink->AddLine({x2, y2});
  sink->EndFigure(D2D1_FIGURE_END_OPEN);

  Geometry(make<RNSVG::implementation::D2DGeometry>(geometry.as<ID2D1Geometry>()));
}
} // namespace winrt::RNSVG::implementation
