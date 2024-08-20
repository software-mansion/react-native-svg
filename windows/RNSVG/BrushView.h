#pragma once
#include "BrushView.g.h"
#include "GroupView.h"
#include "D2DBrush.h"

namespace winrt::RNSVG::implementation {
struct BrushView : BrushViewT<BrushView, RNSVG::implementation::GroupView> {
 public:
  BrushView() = default;

#ifdef USE_FABRIC
  BrushView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args);
#endif

  // IRenderable
  void SaveDefinition();

  RNSVG::D2DBrush Brush() { return m_brush; }
  virtual void CreateBrush() {}
  virtual void Unload();
  void SetBounds(Windows::Foundation::Rect const &rect);

 protected:
  RNSVG::D2DBrush m_brush;
  D2D1_RECT_F m_bounds;
  D2D1::Matrix3x2F m_transform{D2D1::Matrix3x2F::Identity()};

  virtual void UpdateBounds() {}
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct BrushView : BrushViewT<BrushView, implementation::BrushView> {};
} // namespace winrt::RNSVG::factory_implementation
