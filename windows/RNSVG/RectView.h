#pragma once

#include "RectView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {
struct RectView : RectViewT<RectView, RNSVG::implementation::RenderableView> {
 public:
  RectView() = default;

  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
  void CreateGeometry(Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &canvas);

 private:
  RNSVG::SVGLength m_width{};
  RNSVG::SVGLength m_height{};
  RNSVG::SVGLength m_x{};
  RNSVG::SVGLength m_y{};
  RNSVG::SVGLength m_rx{};
  RNSVG::SVGLength m_ry{};
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct RectView : RectViewT<RectView, implementation::RectView> {};
} // namespace winrt::RNSVG::factory_implementation
