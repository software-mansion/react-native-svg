#pragma once

#ifdef USE_FABRIC
#include "CircleProps.g.h"
#endif

#include "RenderableView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(CircleProps)
struct CircleProps : CirclePropsT<CircleProps, SvgRenderableCommonProps> {
  CircleProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(r)
  D2D1_SVG_LENGTH r{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(cx)
  D2D1_SVG_LENGTH cx{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(cy)
  D2D1_SVG_LENGTH cy{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
};


struct CircleView : winrt::implements<CircleView, IInspectable, RenderableView> {
 public: 
  CircleView() = default;

  const wchar_t *GetSvgElementName() noexcept override;
  void OnRender(ID2D1SvgDocument & /*document*/, ID2D1SvgElement & /*element*/) noexcept override;

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;
};
} // namespace winrt::RNSVG::implementation
