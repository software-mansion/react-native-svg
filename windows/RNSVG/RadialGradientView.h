#pragma once
#include "RadialGradientView.g.h"
#include "BrushView.h"

namespace winrt::RNSVG::implementation {
struct RadialGradientView : RadialGradientViewT<RadialGradientView, RNSVG::implementation::BrushView> {
 public:
  RadialGradientView() = default;

  // RenderableView
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
  void Unload();

 private:
  RNSVG::SVGLength m_fx{};
  RNSVG::SVGLength m_fy{};
  RNSVG::SVGLength m_rx{};
  RNSVG::SVGLength m_ry{};
  RNSVG::SVGLength m_cx{};
  RNSVG::SVGLength m_cy{};
  std::vector<Microsoft::Graphics::Canvas::Brushes::CanvasGradientStop> m_stops{};
  std::string m_gradientUnits{"objectBoundingBox"};
  bool m_transformSet{false};
  Numerics::float3x2 m_transform{Numerics::make_float3x2_scale(1)};

  void CreateBrush();
  void UpdateBounds();
  void SetPoints(Microsoft::Graphics::Canvas::Brushes::CanvasRadialGradientBrush brush, Windows::Foundation::Rect const &bounds);
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct RadialGradientView : RadialGradientViewT<RadialGradientView, implementation::RadialGradientView> {};
} // namespace winrt::RNSVG::factory_implementation
