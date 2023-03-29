#include "pch.h"
#include "RadialGradientView.h"
#include "RadialGradientView.g.cpp"

#include "Utils.h"

namespace winrt::RNSVG::implementation {
void RadialGradientView::UpdateProperties(
    winrt::Microsoft::ReactNative::IJSValueReader const &reader,
    bool forceUpdate,
    bool invalidate) {
  const winrt::Microsoft::ReactNative::JSValueObject &propertyMap{
      winrt::Microsoft::ReactNative::JSValue::ReadObjectFrom(reader)};

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
      m_transform = Utils::JSValueAsD2DTransform(propertyValue);

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

void RadialGradientView::CreateBrush(winrt::Microsoft::Graphics::Canvas::CanvasDrawingSession const &session) {
  auto const &canvas{SvgRoot().Canvas()};

  winrt::com_ptr<ID2D1DeviceContext1> deviceContext{D2DHelpers::GetDeviceContext(session)};
  winrt::com_ptr<ID2D1GradientStopCollection> stopCollection;
  winrt::check_hresult(deviceContext->CreateGradientStopCollection(&m_stops[0], m_stops.size(), stopCollection.put()));

  D2D1_RADIAL_GRADIENT_BRUSH_PROPERTIES brushProperties;
  winrt::com_ptr<ID2D1RadialGradientBrush> radialBrush;
  winrt::check_hresult(
      deviceContext->CreateRadialGradientBrush(brushProperties, stopCollection.get(), radialBrush.put()));

  SetPoints(radialBrush.get(), {0, 0, canvas.Size().Width, canvas.Size().Height});

  if (m_transformSet) {
    radialBrush->SetTransform(m_transform);
  }

  winrt::copy_from_abi(m_brush, radialBrush.get());
}

void RadialGradientView::UpdateBounds() {
  if (m_gradientUnits == "objectBoundingBox") {
    winrt::com_ptr<ID2D1RadialGradientBrush> brush;
    winrt::copy_to_abi(m_brush, *brush.put_void());
    SetPoints(brush.get(), m_bounds);
  }
}

void RadialGradientView::SetPoints(ID2D1RadialGradientBrush *brush, D2D1_RECT_F bounds) {
  float width{bounds.right - bounds.left};
  float height{bounds.bottom - bounds.top};

  float rx{Utils::GetAbsoluteLength(m_rx, width)};
  float ry{Utils::GetAbsoluteLength(m_ry, height)};

  float fx{Utils::GetAbsoluteLength(m_fx, width) + bounds.left};
  float fy{Utils::GetAbsoluteLength(m_fy, height) + bounds.top};

  float cx{Utils::GetAbsoluteLength(m_cx, width) + bounds.left};
  float cy{Utils::GetAbsoluteLength(m_cy, height) + bounds.top};

  brush->SetRadiusX(rx);
  brush->SetRadiusY(ry);

  brush->SetCenter({cx, cy});
  brush->SetGradientOriginOffset({(fx - cx), (fy - cy)});
}

} // namespace winrt::RNSVG::implementation
