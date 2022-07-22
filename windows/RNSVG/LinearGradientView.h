#pragma once
#include "LinearGradientView.g.h"
#include "BrushView.h"

namespace winrt::RNSVG::implementation {
struct LinearGradientView : LinearGradientViewT<LinearGradientView, RNSVG::implementation::BrushView> {
 public:
  LinearGradientView() = default;

  // RenderableView
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
  void Unload();

 private:
  RNSVG::SVGLength m_x1{};
  RNSVG::SVGLength m_y1{};
  RNSVG::SVGLength m_x2{};
  RNSVG::SVGLength m_y2{};
  std::vector<Microsoft::Graphics::Canvas::Brushes::CanvasGradientStop> m_stops{};
  std::string m_gradientUnits{"objectBoundingBox"};
  bool m_transformSet{false};
  Numerics::float3x2 m_transform{Numerics::make_float3x2_scale(1)};

  void CreateBrush();
  void UpdateBounds();
  void SetPoints(Microsoft::Graphics::Canvas::Brushes::CanvasLinearGradientBrush brush, Windows::Foundation::Rect const &bounds);
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct LinearGradientView : LinearGradientViewT<LinearGradientView, implementation::LinearGradientView> {};
} // namespace winrt::RNSVG::factory_implementation
