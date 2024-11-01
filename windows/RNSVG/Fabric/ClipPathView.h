#pragma once

#include "ClipPathProps.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(ClipPathProps)
struct ClipPathProps : ClipPathPropsT<ClipPathProps, SvgGroupCommonProps> {
  ClipPathProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;
  REACT_SVG_GROUP_COMMON_PROPS;
};

struct ClipPathView : winrt::implements<ClipPathView, IInspectable, RenderableView> {
 public:
  ClipPathView() = default;

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;

  const wchar_t *GetSvgElementName() noexcept override;
};

} // namespace winrt::RNSVG::implementation
