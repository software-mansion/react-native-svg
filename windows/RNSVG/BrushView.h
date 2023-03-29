#pragma once
#include "BrushView.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {
struct BrushView : BrushViewT<BrushView, RNSVG::implementation::GroupView> {
 public:
  BrushView() = default;

  void SaveDefinition();

  winrt::Windows::Foundation::IInspectable Brush() { return m_brush; }
  virtual void CreateBrush(winrt::Microsoft::Graphics::Canvas::CanvasDrawingSession const &/*session*/) {}
  virtual void Unload();
  void SetBounds(Windows::Foundation::Rect const &rect);


 protected:
  winrt::Windows::Foundation::IInspectable m_brush{nullptr};
   //Microsoft::Graphics::Canvas::Brushes::ICanvasBrush m_brush{nullptr};
  D2D1_RECT_F m_bounds;

  virtual void UpdateBounds() {}
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct BrushView : BrushViewT<BrushView, implementation::BrushView> {};
} // namespace winrt::RNSVG::factory_implementation
