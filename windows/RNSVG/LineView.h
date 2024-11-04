#pragma once

#include "LineView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {

struct LineView : LineViewT<LineView, RNSVG::implementation::RenderableView> {
 public:
  LineView() = default;

  // IRenderablePaper
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);

  // IRenderable
  void CreateGeometry(RNSVG::D2DDeviceContext const &context);

 private:
  RNSVG::SVGLength m_x1{};
  RNSVG::SVGLength m_y1{};
  RNSVG::SVGLength m_x2{};
  RNSVG::SVGLength m_y2{};
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct LineView : LineViewT<LineView, implementation::LineView> {};
} // namespace winrt::RNSVG::factory_implementation
