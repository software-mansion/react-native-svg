#pragma once

#include "DefsProps.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(DefsProps)
struct DefsProps : DefsPropsT<DefsProps, SvgGroupCommonProps> {
  DefsProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;
  REACT_SVG_GROUP_COMMON_PROPS;

};

struct DefsView : winrt::implements<DefsView, IInspectable, RenderableView> {
 public:
  DefsView() = default;

  const wchar_t *GetSvgElementName() noexcept override;

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;

};
} // namespace winrt::RNSVG::implementation
