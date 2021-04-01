#include "pch.h"
#include "RectView.h"
#if __has_include("RectView.g.cpp")
#include "RectView.g.cpp"
#endif

#include "JSValueXaml.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void RectView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap = JSValue::ReadObjectFrom(reader);

  for (auto const &pair : propertyMap) {
    auto const &propertyName = pair.first;
    auto const &propertyValue = pair.second;

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

void RectView::CreateGeometry(UI::Xaml::CanvasControl const &canvas) {
  auto resourceCreator{canvas.try_as<ICanvasResourceCreator>()};

  auto rxLength{m_rx.Unit() == RNSVG::UnitType::Unknown ? m_ry : m_rx};
  auto ryLength{m_ry.Unit() == RNSVG::UnitType::Unknown ? m_rx : m_ry};
  auto x{Utils::GetSvgLengthValue(m_x, canvas.Size().Width)};
  auto y{Utils::GetSvgLengthValue(m_y, canvas.Size().Height)};
  auto width{Utils::GetSvgLengthValue(m_width, canvas.Size().Width)};
  auto height{Utils::GetSvgLengthValue(m_height, canvas.Size().Height)};
  auto rx{Utils::GetSvgLengthValue(rxLength, canvas.Size().Width)};
  auto ry{Utils::GetSvgLengthValue(ryLength, canvas.Size().Height)};

  Geometry(Geometry::CanvasGeometry::CreateRoundedRectangle(resourceCreator, x, y, width, height, rx, ry));
}
} // namespace winrt::RNSVG::implementation
