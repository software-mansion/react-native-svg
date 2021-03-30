#pragma once
#include "CircleView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {
struct CircleView : CircleViewT<CircleView, RNSVG::implementation::RenderableView> {
 public: 
  CircleView() = default;
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
  void CreateGeometry(Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &canvas);

 private:
  RNSVG::SVGLength m_r{};
  RNSVG::SVGLength m_cx{};
  RNSVG::SVGLength m_cy{};
};
} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation {
struct CircleView : CircleViewT<CircleView, implementation::CircleView> {};
} // namespace winrt::RNSVG::factory_implementation
