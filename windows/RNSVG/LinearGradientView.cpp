#include "pch.h"
#include "LinearGradientView.h"
#if __has_include("LinearGradientView.g.cpp")
#include "LinearGradientView.g.cpp"
#endif

#include "Utils.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
LinearGradientProps::LinearGradientProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void LinearGradientProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

LinearGradientView::LinearGradientView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) : base_type(args) {}

void LinearGradientView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  builder.AddViewComponent(
      L"RNSVGLinearGradient", [](winrt::Microsoft::ReactNative::IReactViewComponentBuilder const &builder) noexcept {
        builder.SetCreateProps([](winrt::Microsoft::ReactNative::ViewProps props) noexcept {
          return winrt::make<winrt::RNSVG::implementation::LinearGradientProps>(props);
        });
        builder.SetCreateComponentView([](const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) noexcept {
          return winrt::make<winrt::RNSVG::implementation::LinearGradientView>(args);
        });
      });
}

void LinearGradientView::UpdateProperties(
    const winrt::Microsoft::ReactNative::IComponentProps &props,
    const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
    bool forceUpdate,
    bool invalidate) noexcept {
  auto linearGradientProps = props.try_as<LinearGradientProps>();
  if (linearGradientProps) {
    m_props = linearGradientProps;

    m_x1 = m_props->x1;
    m_y1 = m_props->y1;
    m_x2 = m_props->x2;
    m_y2 = m_props->y2;

    m_stops = Utils::JSValueAsGradientStops(m_props->gradient);
    m_gradientUnits = Utils::JSValueAsBrushUnits(m_props->gradientUnits);
    m_transform = Utils::JSValueAsD2DTransform(m_props->gradientTransform);
  }

  base_type::UpdateProperties(props, oldProps, forceUpdate, invalidate);

  SaveDefinition();
}
#else
void LinearGradientView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "x1") {
      m_x1 = propertyValue.To<RNSVG::SVGLength>();
    } else if (propertyName == "y1") {
      m_y1 = propertyValue.To<RNSVG::SVGLength>();
    } else if (propertyName == "x2") {
      m_x2 = propertyValue.To<RNSVG::SVGLength>();
    } else if (propertyName == "y2") {
      m_y2 = propertyValue.To<RNSVG::SVGLength>();
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
#endif

void LinearGradientView::Unload() {
  m_stops.clear();
  __super::Unload();
}

void LinearGradientView::CreateBrush() {
  auto const root{SvgRoot()};

  com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(root.DeviceContext())->Get()};

  winrt::com_ptr<ID2D1GradientStopCollection> stopCollection;
  winrt::check_hresult(deviceContext->CreateGradientStopCollection(&m_stops[0], static_cast<uint32_t>(m_stops.size()), stopCollection.put()));

  Size size{root.CanvasSize()};

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

void LinearGradientView::SetPoints(ID2D1LinearGradientBrush *brush, D2D1_RECT_F bounds) {
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
