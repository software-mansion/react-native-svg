#pragma once
#include "ClipPathView.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {
struct ClipPathView : ClipPathViewT<ClipPathView, RNSVG::implementation::GroupView> {
 public:
  ClipPathView() = default;

  // RenderableView
  void Render(
      Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const & /*canvas*/,
      Microsoft::Graphics::Canvas::CanvasDrawingSession const & /*session*/){};
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct ClipPathView : ClipPathViewT<ClipPathView, implementation::ClipPathView> {};
} // namespace winrt::RNSVG::factory_implementation
