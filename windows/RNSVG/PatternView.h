#pragma once
#include "PatternView.g.h"
#include "BrushView.h"

namespace winrt::RNSVG::implementation {
struct PatternView : PatternViewT<PatternView, RNSVG::implementation::BrushView> {
 public:
  PatternView() = default;

  // RenderableView
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
  void Draw(RNSVG::D2DDeviceContext const & /*deviceContext*/, Windows::Foundation::Size const & /*size*/){};

 private:
  RNSVG::SVGLength m_x{};
  RNSVG::SVGLength m_y{};
  RNSVG::SVGLength m_width{};
  RNSVG::SVGLength m_height{};
  std::string m_patternUnits{"objectBoundingBox"};
  std::string m_patternContentUnits{"userSpaceOnUse"};

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
  void CreateBrush(D2D1_RECT_F rect);
  D2D1_RECT_F GetAdjustedRect(D2D1_RECT_F bounds);
  winrt::com_ptr<ID2D1CommandList> GetCommandList(ID2D1Device* device, D2D1_RECT_F elRect);
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct PatternView : PatternViewT<PatternView, implementation::PatternView> {};
} // namespace winrt::RNSVG::factory_implementation
