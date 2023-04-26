#include "pch.h"
#include "CircleView.h"
#include "CircleView.g.cpp"

#include "JSValueXaml.h"
#include "Utils.h"

namespace winrt::RNSVG::implementation {
void CircleView::UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const Microsoft::ReactNative::JSValueObject &propertyMap{
      Microsoft::ReactNative::JSValue::ReadObjectFrom(reader)};

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

void CircleView::CreateGeometry(win2d::UI::Xaml::CanvasControl const &canvas) {
  float cx{Utils::GetAbsoluteLength(m_cx, canvas.Size().Width)};
  float cy{Utils::GetAbsoluteLength(m_cy, canvas.Size().Height)};
  float r{Utils::GetAbsoluteLength(m_r, Utils::GetCanvasDiagonal(canvas.Size()))};

  auto factory{D2DHelpers::GetFactory(canvas)};
  com_ptr<ID2D1EllipseGeometry> geometry;
  check_hresult(factory->CreateEllipseGeometry(D2D1::Ellipse({cx, cy}, r, r), geometry.put()));

  IInspectable asInspectable;
  copy_from_abi(asInspectable, geometry.get());

  Geometry(asInspectable);
}
} // namespace winrt::RNSVG::implementation
