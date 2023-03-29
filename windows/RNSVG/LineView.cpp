#include "pch.h"
#include "LineView.h"
#include "LineView.g.cpp"

#include "JSValueXaml.h"
#include "Utils.h"

namespace winrt::RNSVG::implementation {
void LineView::UpdateProperties(
    winrt::Microsoft::ReactNative::IJSValueReader const &reader,
    bool forceUpdate,
    bool invalidate) {
  const winrt::Microsoft::ReactNative::JSValueObject &propertyMap{
      winrt::Microsoft::ReactNative::JSValue::ReadObjectFrom(reader)};

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
void LineView::CreateGeometry(winrt::Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &canvas) {
  auto const &resourceCreator{canvas.try_as<winrt::Microsoft::Graphics::Canvas::ICanvasResourceCreator>()};

  float x1{Utils::GetAbsoluteLength(m_x1, canvas.Size().Width)};
  float y1{Utils::GetAbsoluteLength(m_y1, canvas.Size().Height)};
  float x2{Utils::GetAbsoluteLength(m_x2, canvas.Size().Width)};
  float y2{Utils::GetAbsoluteLength(m_y2, canvas.Size().Height)};

  auto const &pathBuilder{winrt::Microsoft::Graphics::Canvas::Geometry::CanvasPathBuilder(resourceCreator)};
  pathBuilder.BeginFigure(x1, y1);
  pathBuilder.AddLine (x2, y2);
  pathBuilder.EndFigure(winrt::Microsoft::Graphics::Canvas::Geometry::CanvasFigureLoop::Open);
  Geometry(winrt::Microsoft::Graphics::Canvas::Geometry::CanvasGeometry::CreatePath(pathBuilder));
}
} // namespace winrt::RNSVG::implementation
