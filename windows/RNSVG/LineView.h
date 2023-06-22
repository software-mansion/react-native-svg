#pragma once
#include "LineView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {
struct LineView : LineViewT<LineView, RNSVG::implementation::RenderableView> {
 public:
  LineView() = default;
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
  void CreateGeometry(Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &canvas);

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
