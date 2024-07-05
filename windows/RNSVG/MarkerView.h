#pragma once
#include "MarkerView.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {
struct MarkerView : MarkerViewT<MarkerView, RNSVG::implementation::GroupView> {
 public:
  MarkerView() = default;

  // RenderableView
  void Draw(RNSVG::D2DDeviceContext const & /*deviceContext*/, Windows::Foundation::Size const & /*size*/){};
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct MarkerView : MarkerViewT<MarkerView, implementation::MarkerView> {};
} // namespace winrt::RNSVG::factory_implementation
