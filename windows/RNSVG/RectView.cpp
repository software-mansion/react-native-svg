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

void RectView::CreateGeometry(UI::Xaml::CanvasControl const &canvas) {
  auto const &resourceCreator{canvas.try_as<ICanvasResourceCreator>()};

  float x{Utils::GetAbsoluteLength(m_x, canvas.Size().Width)};
  float y{Utils::GetAbsoluteLength(m_y, canvas.Size().Height)};
  float width{Utils::GetAbsoluteLength(m_width, canvas.Size().Width)};
  float height{Utils::GetAbsoluteLength(m_height, canvas.Size().Height)};

  auto const &rxLength{m_rx.Unit() == RNSVG::LengthType::Unknown ? m_ry : m_rx};
  auto const &ryLength{m_ry.Unit() == RNSVG::LengthType::Unknown ? m_rx : m_ry};
  float rx{Utils::GetAbsoluteLength(rxLength, canvas.Size().Width)};
  float ry{Utils::GetAbsoluteLength(ryLength, canvas.Size().Height)};

  Geometry(Geometry::CanvasGeometry::CreateRoundedRectangle(resourceCreator, x, y, width, height, rx, ry));
}
} // namespace winrt::RNSVG::implementation
