#include "pch.h"
#include "LineView.h"
#include "LineView.g.cpp"

#include "JSValueXaml.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
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
void LineView::CreateGeometry(UI::Xaml::CanvasControl const &canvas) {
  auto const &resourceCreator{canvas.try_as<ICanvasResourceCreator>()};

  float x1{Utils::GetAbsoluteLength(m_x1, canvas.Size().Width)};
  float y1{Utils::GetAbsoluteLength(m_y1, canvas.Size().Height)};
  float x2{Utils::GetAbsoluteLength(m_x2, canvas.Size().Width)};
  float y2{Utils::GetAbsoluteLength(m_y2, canvas.Size().Height)};

  auto const &pathBuilder{Geometry::CanvasPathBuilder(resourceCreator)};
  pathBuilder.BeginFigure(x1, y1);
  pathBuilder.AddLine (x2, y2);
  pathBuilder.EndFigure(Geometry::CanvasFigureLoop::Open);
  Geometry(Geometry::CanvasGeometry::CreatePath(pathBuilder));
}
} // namespace winrt::RNSVG::implementation
