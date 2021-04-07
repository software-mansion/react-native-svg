#include "pch.h"
#include "LinearGradientView.h"
#include "LinearGradientView.g.cpp"

#include "Utils.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void LinearGradientView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
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
    } else if (propertyName == "gradient") {
      m_stops = Utils::JSValueAsStops(propertyValue);
    } else if (propertyName == "gradientUnits") {
      m_gradientUnits = Utils::JSValueAsBrushUnits(propertyValue);
    } else if (propertyName == "gradientTransform") {
      m_transformSet = true;
      m_transform = Utils::JSValueAsTransform(propertyValue);

      if (propertyValue.IsNull()) {
        m_transformSet = false;
      }
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);

  SaveDefinition();
}

void LinearGradientView::Unload() {
  m_stops.clear();
  __super::Unload();
}

void LinearGradientView::CreateBrush() {
  auto const &canvas{SvgRoot().Canvas()};
  auto const &resourceCreator{canvas.try_as<ICanvasResourceCreator>()};
  Brushes::CanvasLinearGradientBrush brush{resourceCreator, m_stops};

  SetPoints(brush, {0, 0, canvas.Size().Width, canvas.Size().Height});

  if (m_transformSet) {
    brush.Transform(m_transform);
  }

  m_brush = brush;
}

void LinearGradientView::UpdateBounds() {
  if (m_gradientUnits == "objectBoundingBox") {
    SetPoints(m_brush.as<Brushes::CanvasLinearGradientBrush>(), m_bounds);
  }
}

void LinearGradientView::SetPoints(Brushes::CanvasLinearGradientBrush brush, Windows::Foundation::Rect const &bounds) {
  float x1{Utils::GetAbsoluteLength(m_x1, bounds.Width) + bounds.X};
  float y1{Utils::GetAbsoluteLength(m_y1, bounds.Height) + bounds.Y};
  float x2{Utils::GetAbsoluteLength(m_x2, bounds.Width) + bounds.X};
  float y2{Utils::GetAbsoluteLength(m_y2, bounds.Height) + bounds.Y};

  brush.StartPoint({x1, y1});
  brush.EndPoint({x2, y2});
}

} // namespace winrt::RNSVG::implementation
