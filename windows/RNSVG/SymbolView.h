#pragma once
#include "SymbolView.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {
struct SymbolView : SymbolViewT<SymbolView, RNSVG::implementation::GroupView> {
 public:
  SymbolView() = default;

  float MinX() { return m_minX; }
  float MinY() { return m_minY; }
  float VbWidth() { return m_vbWidth; }
  float VbHeight() { return m_vbHeight; }
  hstring Align() { return to_hstring(m_align); }
  RNSVG::MeetOrSlice MeetOrSlice() { return m_meetOrSlice; }

  // RenderableView
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
  void Draw(RNSVG::D2DDeviceContext const & /*deviceContext*/, Windows::Foundation::Size const & /*size*/){};

 private:
  float m_minX{0.0f};
  float m_minY{0.0f};
  float m_vbWidth{0.0f};
  float m_vbHeight{0.0f};
  std::string m_align{""};
  RNSVG::MeetOrSlice m_meetOrSlice{RNSVG::MeetOrSlice::Meet};
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct SymbolView : SymbolViewT<SymbolView, implementation::SymbolView> {};
} // namespace winrt::RNSVG::factory_implementation
