#pragma once

#include "LinearGradientView.g.h"
#include "BrushView.h"

namespace winrt::RNSVG::implementation {

struct LinearGradientView : LinearGradientViewT<LinearGradientView, RNSVG::implementation::BrushView> {
 public:
  LinearGradientView() = default;

  // IRenderablePaper
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);

  // IRenderable
  void Unload();

 private:
  RNSVG::SVGLength m_x1{};
  RNSVG::SVGLength m_y1{};
  RNSVG::SVGLength m_x2{};
  RNSVG::SVGLength m_y2{};
  std::vector<D2D1_GRADIENT_STOP> m_stops{};
  std::string m_gradientUnits{"objectBoundingBox"};

  // BrushView
  void CreateBrush();
  void UpdateBounds();
  void SetPoints(ID2D1LinearGradientBrush *brush, D2D1_RECT_F bounds);
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct LinearGradientView : LinearGradientViewT<LinearGradientView, implementation::LinearGradientView> {};
} // namespace winrt::RNSVG::factory_implementation
