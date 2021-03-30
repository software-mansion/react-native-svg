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
  const JSValueObject &propertyMap = JSValue::ReadObjectFrom(reader);

  for (auto const &pair : propertyMap) {
    auto const &propertyName = pair.first;
    auto const &propertyValue = pair.second;

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
  auto resourceCreator{canvas.try_as<ICanvasResourceCreator>()};

  auto x1{Utils::GetSvgLengthValue(m_x1, canvas.Size().Width)};
  auto y1{Utils::GetSvgLengthValue(m_y1, canvas.Size().Height)};
  auto x2{Utils::GetSvgLengthValue(m_x2, canvas.Size().Width)};
  auto y2{Utils::GetSvgLengthValue(m_y2, canvas.Size().Height)};

  auto pathBuilder = Geometry::CanvasPathBuilder(resourceCreator);
  pathBuilder.BeginFigure(x1, y1);
  pathBuilder.AddLine (x2, y2);
  pathBuilder.EndFigure(Geometry::CanvasFigureLoop::Open);
  Geometry(Geometry::CanvasGeometry::CreatePath(pathBuilder));
}
} // namespace winrt::RNSVG::implementation
