#include "pch.h"
#include "CircleView.h"
#include "CircleView.g.cpp"

#include "JSValueXaml.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void CircleView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

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

void CircleView::CreateGeometry(UI::Xaml::CanvasControl const &canvas) {
  auto const &resourceCreator{canvas.try_as<ICanvasResourceCreator>()};

  float cx{Utils::GetAbsoluteLength(m_cx, canvas.Size().Width)};
  float cy{Utils::GetAbsoluteLength(m_cy, canvas.Size().Height)};
  float r{Utils::GetAbsoluteLength(m_r, Utils::GetCanvasDiagonal(canvas.Size()))};

  Geometry(Geometry::CanvasGeometry::CreateCircle(resourceCreator, cx, cy, r));
}
} // namespace winrt::RNSVG::implementation
