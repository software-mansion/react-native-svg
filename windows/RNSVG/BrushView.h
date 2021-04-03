#pragma once
#include "BrushView.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {
struct BrushView : BrushViewT<BrushView, RNSVG::implementation::GroupView> {
 public:
  BrushView() = default;

  void SaveDefinition();

  Microsoft::Graphics::Canvas::Brushes::ICanvasBrush Brush() { return m_brush; }
  virtual void CreateBrush() {}
  virtual void Unload();
  void SetBounds(Windows::Foundation::Rect const &rect);


 protected:
  Microsoft::Graphics::Canvas::Brushes::ICanvasBrush m_brush{nullptr};
  Windows::Foundation::Rect m_bounds{};

  virtual void UpdateBounds() {}
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct BrushView : BrushViewT<BrushView, implementation::BrushView> {};
} // namespace winrt::RNSVG::factory_implementation
