#include "pch.h"
#include "LineView.h"
#include "LineView.g.cpp"

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
      m_x1 = SVGLength::From(propertyValue);
    } else if (propertyName == "y1") {
      m_y1 = SVGLength::From(propertyValue);
    } else if (propertyName == "x2") {
      m_x2 = SVGLength::From(propertyValue);
    } else if (propertyName == "y2") {
      m_y2 = SVGLength::From(propertyValue);
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}
void LineView::CreateGeometry() {
  auto const &root{SvgRoot()};

  float x1{Utils::GetAbsoluteLength(m_x1, root.ActualWidth())};
  float y1{Utils::GetAbsoluteLength(m_y1, root.ActualHeight())};
  float x2{Utils::GetAbsoluteLength(m_x2, root.ActualWidth())};
  float y2{Utils::GetAbsoluteLength(m_y2, root.ActualHeight())};

  com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(root.DeviceContext())->Get()};

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
