#pragma once
#include "EllipseView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {
struct EllipseView : EllipseViewT<EllipseView, RNSVG::implementation::RenderableView> {
 public:
  EllipseView() = default;
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
  void CreateGeometry(Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &canvas);

 private:
  RNSVG::SVGLength m_cx{};
  RNSVG::SVGLength m_cy{};
  RNSVG::SVGLength m_rx{};
  RNSVG::SVGLength m_ry{};
};
} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation {
struct EllipseView : EllipseViewT<EllipseView, implementation::EllipseView> {};
} // namespace winrt::RNSVG::factory_implementation
