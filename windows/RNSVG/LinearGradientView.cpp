#include "pch.h"
#include "LinearGradientView.h"
#include "LinearGradientView.g.cpp"

#include "Utils.h"

namespace winrt::RNSVG::implementation {
void LinearGradientView::UpdateProperties(
    Microsoft::ReactNative::IJSValueReader const &reader,
    bool forceUpdate,
    bool invalidate) {
  const Microsoft::ReactNative::JSValueObject &propertyMap{
      Microsoft::ReactNative::JSValue::ReadObjectFrom(reader)};

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
      m_transform = Utils::JSValueAsD2DTransform(propertyValue);

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
  auto const root{SvgRoot()};

  com_ptr<ID2D1DeviceContext1> deviceContext;
  copy_to_abi(root.DeviceContext(), *deviceContext.put_void());

  winrt::com_ptr<ID2D1GradientStopCollection> stopCollection;
  winrt::check_hresult(deviceContext->CreateGradientStopCollection(&m_stops[0], static_cast<uint32_t>(m_stops.size()), stopCollection.put()));

  D2D1_LINEAR_GRADIENT_BRUSH_PROPERTIES brushProperties;
  brushProperties.startPoint = {0, 0};
  brushProperties.endPoint = {static_cast<float>(root.ActualWidth()), static_cast<float>(root.ActualHeight())};

  winrt::com_ptr<ID2D1LinearGradientBrush> linearBrush;
  winrt::check_hresult(deviceContext->CreateLinearGradientBrush(brushProperties, stopCollection.get(), linearBrush.put()));

  SetPoints(linearBrush.get(), {0, 0, static_cast<float>(root.ActualWidth()), static_cast<float>(root.ActualHeight())});

  if (m_transformSet) {
    linearBrush->SetTransform(m_transform);
  }

  winrt::copy_from_abi(m_brush, linearBrush.get());
}

void LinearGradientView::UpdateBounds() {
  if (m_gradientUnits == "objectBoundingBox") {
    winrt::com_ptr<ID2D1LinearGradientBrush> brush;
    winrt::copy_to_abi(m_brush, *brush.put_void());
    SetPoints(brush.get(), m_bounds);
  }
}

void LinearGradientView::SetPoints(ID2D1LinearGradientBrush * brush, D2D1_RECT_F bounds) {
  float width{bounds.right - bounds.left};
  float height{bounds.bottom - bounds.top};

  float x1{Utils::GetAbsoluteLength(m_x1, width) + bounds.left}; // just right?
  float y1{Utils::GetAbsoluteLength(m_y1, height) + bounds.top};
  float x2{Utils::GetAbsoluteLength(m_x2, width) + bounds.left};
  float y2{Utils::GetAbsoluteLength(m_y2, height) + bounds.top};

  brush->SetStartPoint({x1, y1});
  brush->SetEndPoint({x2, y2});
}

} // namespace winrt::RNSVG::implementation
