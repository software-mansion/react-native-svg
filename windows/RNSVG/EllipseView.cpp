#include "pch.h"
#include "EllipseView.h"
#include "EllipseView.g.cpp"

#include "JSValueXaml.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void EllipseView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "cx") {
      m_cx = SVGLength::From(propertyValue);
    } else if (propertyName == "cy") {
      m_cy = SVGLength::From(propertyValue);
    } else if (propertyName == "rx") {
      m_rx = SVGLength::From(propertyValue);
    } else if (propertyName == "ry") {
      m_ry = SVGLength::From(propertyValue);
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}

void EllipseView::CreateGeometry(UI::Xaml::CanvasControl const &canvas) {
  auto const &resourceCreator{canvas.try_as<ICanvasResourceCreator>()};

  float cx{Utils::GetAbsoluteLength(m_cx, canvas.Size().Width)};
  float cy{Utils::GetAbsoluteLength(m_cy, canvas.Size().Height)};
  float rx{Utils::GetAbsoluteLength(m_rx, canvas.Size().Width)};
  float ry{Utils::GetAbsoluteLength(m_ry, canvas.Size().Height)};

  Geometry(Geometry::CanvasGeometry::CreateEllipse(resourceCreator, cx, cy, rx, ry));
}
} // namespace winrt::RNSVG::implementation
