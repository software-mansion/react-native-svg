#include "pch.h"
#include "RadialGradientView.h"
#include "RadialGradientView.g.cpp"

#include "Utils.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void RadialGradientView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "fx") {
      m_fx = SVGLength::From(propertyValue);
    } else if (propertyName == "fy") {
      m_fy = SVGLength::From(propertyValue);
    } else if (propertyName == "rx") {
      m_rx = SVGLength::From(propertyValue);
    } else if (propertyName == "ry") {
      m_ry = SVGLength::From(propertyValue);
    } else if (propertyName == "cx") {
      m_cx = SVGLength::From(propertyValue);
    } else if (propertyName == "cy") {
      m_cy = SVGLength::From(propertyValue);
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

void RadialGradientView::Unload() {
  m_stops.clear();
  __super::Unload();
}

void RadialGradientView::CreateBrush() {
  auto const &canvas{SvgRoot().Canvas()};
  auto const &resourceCreator{canvas.try_as<ICanvasResourceCreator>()}; 
  Brushes::CanvasRadialGradientBrush brush{resourceCreator, m_stops};

  SetPoints(brush, {0, 0, canvas.Size().Width, canvas.Size().Height});

  if (m_transformSet) {
    brush.Transform(m_transform);
  }

  m_brush = brush;
}

void RadialGradientView::UpdateBounds() {
  if (m_gradientUnits == "objectBoundingBox") {
    SetPoints(m_brush.as<Brushes::CanvasRadialGradientBrush>(), m_bounds);
  }
}

void RadialGradientView::SetPoints(Brushes::CanvasRadialGradientBrush brush, Windows::Foundation::Rect const &bounds) {
  float rx{Utils::GetAbsoluteLength(m_rx, bounds.Width)};
  float ry{Utils::GetAbsoluteLength(m_ry, bounds.Height)};

  float fx{Utils::GetAbsoluteLength(m_fx, bounds.Width) + bounds.X};
  float fy{Utils::GetAbsoluteLength(m_fy, bounds.Height) + bounds.Y};

  float cx{Utils::GetAbsoluteLength(m_cx, bounds.Width) + bounds.X};
  float cy{Utils::GetAbsoluteLength(m_cy, bounds.Height) + bounds.Y};

  brush.RadiusX(rx);
  brush.RadiusY(ry);

  brush.Center({cx, cy});
  brush.OriginOffset({(fx - cx), (fy - cy)});
}

} // namespace winrt::RNSVG::implementation
