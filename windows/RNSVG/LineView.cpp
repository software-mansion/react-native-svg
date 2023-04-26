#include "pch.h"
#include "LineView.h"
#include "LineView.g.cpp"

#include "JSValueXaml.h"
#include "Utils.h"

namespace winrt::RNSVG::implementation {
void LineView::UpdateProperties(
    Microsoft::ReactNative::IJSValueReader const &reader,
    bool forceUpdate,
    bool invalidate) {
  const Microsoft::ReactNative::JSValueObject &propertyMap{
      Microsoft::ReactNative::JSValue::ReadObjectFrom(reader)};

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
void LineView::CreateGeometry(win2d::UI::Xaml::CanvasControl const &canvas) {
  float x1{Utils::GetAbsoluteLength(m_x1, canvas.Size().Width)};
  float y1{Utils::GetAbsoluteLength(m_y1, canvas.Size().Height)};
  float x2{Utils::GetAbsoluteLength(m_x2, canvas.Size().Width)};
  float y2{Utils::GetAbsoluteLength(m_y2, canvas.Size().Height)};

  auto factory{D2DHelpers::GetFactory(canvas)};

  com_ptr<ID2D1PathGeometry> geometry;
  check_hresult(factory->CreatePathGeometry(geometry.put()));

  com_ptr<ID2D1GeometrySink> sink;
  check_hresult(geometry->Open(sink.put()));

  // hollow instead of filled??
  sink->BeginFigure({x1, y1}, D2D1_FIGURE_BEGIN_FILLED);
  sink->AddLine({x2, y2});
  sink->EndFigure(D2D1_FIGURE_END_OPEN);

  IInspectable asInspectable;
  copy_from_abi(asInspectable, geometry.get());

  Geometry(asInspectable);
}
} // namespace winrt::RNSVG::implementation
