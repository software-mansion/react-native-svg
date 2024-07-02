#pragma once

#ifdef USE_FABRIC
#include "ClipPathProps.g.h"
#endif

#include "ClipPathView.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {
#ifdef USE_FABRIC
REACT_STRUCT(ClipPathProps)
struct ClipPathProps : ClipPathPropsT<ClipPathProps, SvgGroupCommonProps> {
  ClipPathProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;
  REACT_SVG_GROUP_COMMON_PROPS;
};
#endif
struct ClipPathView : ClipPathViewT<ClipPathView, RNSVG::implementation::GroupView> {
 public:
  ClipPathView() = default;

#ifdef USE_FABRIC
  ClipPathView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args);

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;
#endif

  // IRenderable
  void Draw(RNSVG::D2DDeviceContext const & /*deviceContext*/, Windows::Foundation::Size const & /*size*/){};
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct ClipPathView : ClipPathViewT<ClipPathView, implementation::ClipPathView> {};
} // namespace winrt::RNSVG::factory_implementation
