#pragma once

#include "EllipseView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {

struct EllipseView : EllipseViewT<EllipseView, RNSVG::implementation::RenderableView> {
 public:
  EllipseView() = default;

  // IRenderablePaper
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);

  // IRenderable
  void CreateGeometry(RNSVG::D2DDeviceContext const &context);
  
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
