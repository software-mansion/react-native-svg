#pragma once

#include "CircleView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {

struct CircleView : CircleViewT<CircleView, RNSVG::implementation::RenderableView> {
 public: 
  CircleView() = default;

  // IRenderablePaper
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);

  // IRenderable
  void CreateGeometry(RNSVG::D2DDeviceContext const &context);

 private:
  RNSVG::SVGLength m_r{};
  RNSVG::SVGLength m_cx{};
  RNSVG::SVGLength m_cy{};

};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct CircleView : CircleViewT<CircleView, implementation::CircleView> {};
} // namespace winrt::RNSVG::factory_implementation
