#pragma once

#ifdef USE_FABRIC
#include "TSpanProps.g.h"
#endif

#include "TSpanView.g.h"
#include "TextView.h"

namespace winrt::RNSVG::implementation {
  
#ifdef USE_FABRIC
REACT_STRUCT(TSpanProps)
struct TSpanProps : TSpanPropsT<TSpanProps, SvgTextCommonProps> {
  TSpanProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;
  REACT_SVG_GROUP_COMMON_PROPS;
  REACT_SVG_TEXT_COMMON_PROPS;

  REACT_FIELD(content)
  std::string content{""};
};
#endif

struct TSpanView : TSpanViewT<TSpanView, RNSVG::implementation::TextView> {
public:
  TSpanView() = default;

#ifdef USE_FABRIC
  TSpanView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args);

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

  // IRenderable
  virtual void Draw(RNSVG::D2DDeviceContext const &deviceContext, Windows::Foundation::Size const &size);

 private:
  std::string m_content;

#ifdef USE_FABRIC
  com_ptr<TSpanProps> m_props;
#endif

};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct TSpanView : TSpanViewT<TSpanView, implementation::TSpanView> {};
} // namespace winrt::RNSVG::factory_implementation
