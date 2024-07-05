#include "pch.h"
#include "LinearGradientView.h"
#include "LinearGradientView.g.cpp"

#include "Utils.h"

using namespace winrt;
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
      m_transform = Utils::JSValueAsD2DTransform(propertyValue);

      if (propertyValue.IsNull()) {
        m_transform = D2D1::Matrix3x2F::Identity();
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

  com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(root.DeviceContext())->Get()};

  winrt::com_ptr<ID2D1GradientStopCollection> stopCollection;
  winrt::check_hresult(deviceContext->CreateGradientStopCollection(&m_stops[0], static_cast<uint32_t>(m_stops.size()), stopCollection.put()));

  Size size{static_cast<float>(root.ActualWidth()), static_cast<float>(root.ActualHeight())};

  D2D1_LINEAR_GRADIENT_BRUSH_PROPERTIES brushProperties;
  brushProperties.startPoint = {0, 0};
  brushProperties.endPoint = {size.Width, size.Height};

  winrt::com_ptr<ID2D1LinearGradientBrush> linearBrush;
  winrt::check_hresult(deviceContext->CreateLinearGradientBrush(brushProperties, stopCollection.get(), linearBrush.put()));

  SetPoints(linearBrush.get(), {0, 0, size.Width, size.Height});

  linearBrush->SetTransform(m_transform);

  m_brush = make<RNSVG::implementation::D2DBrush>(linearBrush.as<ID2D1Brush>());
}

void LinearGradientView::UpdateBounds() {
  if (m_gradientUnits == "objectBoundingBox") {
    com_ptr<ID2D1LinearGradientBrush> brush{get_self<D2DBrush>(m_brush)->Get().as<ID2D1LinearGradientBrush>()};
    SetPoints(brush.get(), m_bounds);
  }
}

void LinearGradientView::SetPoints(ID2D1LinearGradientBrush * brush, D2D1_RECT_F bounds) {
  float width{D2DHelpers::WidthFromD2DRect(bounds)};
  float height{D2DHelpers::HeightFromD2DRect(bounds)};

  float x1{Utils::GetAbsoluteLength(m_x1, width) + bounds.left};
  float y1{Utils::GetAbsoluteLength(m_y1, height) + bounds.top};
  float x2{Utils::GetAbsoluteLength(m_x2, width) + bounds.left};
  float y2{Utils::GetAbsoluteLength(m_y2, height) + bounds.top};

  brush->SetStartPoint({x1, y1});
  brush->SetEndPoint({x2, y2});
}

} // namespace winrt::RNSVG::implementation
