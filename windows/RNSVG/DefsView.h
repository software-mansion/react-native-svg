#pragma once

#ifdef USE_FABRIC
#include "DefsProps.g.h"
#endif

#include "DefsView.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
REACT_STRUCT(DefsProps)
struct DefsProps : DefsPropsT<DefsProps, SvgGroupCommonProps> {
  DefsProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;
};
#endif

struct DefsView : DefsViewT<DefsView, RNSVG::implementation::GroupView> {
 public:
  DefsView() = default;

#ifdef USE_FABRIC
  DefsView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args);

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;
#endif

  // IRenderable
  void Draw(RNSVG::D2DDeviceContext const &deviceContext, Windows::Foundation::Size const &size);
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct DefsView : DefsViewT<DefsView, implementation::DefsView> {};
} // namespace winrt::RNSVG::factory_implementation
