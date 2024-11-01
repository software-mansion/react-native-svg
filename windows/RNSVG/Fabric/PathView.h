#pragma once

#include "PathProps.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(PathProps)
struct PathProps : PathPropsT<PathProps, SvgRenderableCommonProps> {
  PathProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(d)
  std::wstring d;
};

struct PathView : winrt::implements<PathView, IInspectable, RenderableView> {
 public:
  PathView() = default;

  const wchar_t *GetSvgElementName() noexcept override;
  void OnRender(ID2D1SvgDocument & /*document*/, ID2D1SvgElement & /*element*/) noexcept override;

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;

};

} // namespace winrt::RNSVG::implementation
