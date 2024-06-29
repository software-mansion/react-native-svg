#pragma once

#ifdef USE_FABRIC
#include "SymbolProps.g.h"
#endif

#include "SymbolView.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
REACT_STRUCT(SymbolProps)
struct SymbolProps : SymbolPropsT<SymbolProps, SvgGroupCommonProps> {
  SymbolProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(minX)
  float minX{0.0f};
  REACT_FIELD(minY)
  float minY{0.0f};
  REACT_FIELD(vbWidth)
  float vbWidth{0.0f};
  REACT_FIELD(vbHeight)
  float vbHeight{0.0f};
  REACT_FIELD(align)
  std::string align{""};
  REACT_FIELD(meetOrSlice)
  RNSVG::MeetOrSlice meetOrSlice{RNSVG::MeetOrSlice::Meet};
};
#endif

struct SymbolView : SymbolViewT<SymbolView, RNSVG::implementation::GroupView> {
 public:
  SymbolView() = default;

#ifdef USE_FABRIC
  SymbolView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args);

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;

  // IRenderableFabric
  void UpdateProperties(
      const winrt::Microsoft::ReactNative::IComponentProps &props,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
      bool forceUpdate = true,
      bool invalidate = true) noexcept override;
#else
  // IRenderablePaper
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
#endif

  float MinX() { return m_minX; }
  float MinY() { return m_minY; }
  float VbWidth() { return m_vbWidth; }
  float VbHeight() { return m_vbHeight; }
  hstring Align() { return to_hstring(m_align); }
  RNSVG::MeetOrSlice MeetOrSlice() { return m_meetOrSlice; }

  // RenderableView
  void Draw(RNSVG::D2DDeviceContext const & /*deviceContext*/, Windows::Foundation::Size const & /*size*/){};

 private:
  float m_minX{0.0f};
  float m_minY{0.0f};
  float m_vbWidth{0.0f};
  float m_vbHeight{0.0f};
  std::string m_align{""};
  RNSVG::MeetOrSlice m_meetOrSlice{RNSVG::MeetOrSlice::Meet};

#ifdef USE_FABRIC
  com_ptr<SymbolProps> m_props;
#endif

};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct SymbolView : SymbolViewT<SymbolView, implementation::SymbolView> {};
} // namespace winrt::RNSVG::factory_implementation
