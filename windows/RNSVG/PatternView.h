#pragma once
#include "PatternView.g.h"
#include "BrushView.h"

namespace winrt::RNSVG::implementation {
struct PatternView : PatternViewT<PatternView, RNSVG::implementation::BrushView> {
 public:
  PatternView() = default;

  // RenderableView
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);

 private:
  RNSVG::SVGLength m_x{};
  RNSVG::SVGLength m_y{};
  RNSVG::SVGLength m_width{};
  RNSVG::SVGLength m_height{};
  std::string m_patternUnits{"objectBoundingBox"};
  std::string m_patternContentUnits{"userSpaceOnUse"};
  bool m_transformSet{false};
  Numerics::float3x2 m_transform{Numerics::make_float3x2_scale(1)};

  // ViewBox
  float m_minX{0.0f};
  float m_minY{0.0f};
  float m_vbWidth{0.0f};
  float m_vbHeight{0.0f};
  std::string m_align{""};
  RNSVG::MeetOrSlice m_meetOrSlice{RNSVG::MeetOrSlice::Meet};

  // BrushView
  void CreateBrush();
  void UpdateBounds();

  // Helpers
  void CreateBrush(Windows::Foundation::Rect const &rect);
  Windows::Foundation::Rect GetAdjustedRect(Windows::Foundation::Rect const &bounds);
  Microsoft::Graphics::Canvas::CanvasCommandList GetCommandList(Windows::Foundation::Rect const &elRect);
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct PatternView : PatternViewT<PatternView, implementation::PatternView> {};
} // namespace winrt::RNSVG::factory_implementation
