#pragma once

#include "RectProps.g.h"
#include "RectView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(RectProps)
struct RectProps : RectPropsT<RectProps, SvgRenderableCommonProps> {
  RectProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(x)
  std::wstring x;
  REACT_FIELD(y)
  std::wstring y;
  REACT_FIELD(height)
  std::wstring height;
  REACT_FIELD(width)
  std::wstring width;
  REACT_FIELD(rx)
  D2D1_SVG_LENGTH rx{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(ry)
  D2D1_SVG_LENGTH ry{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
};

struct RectView : RectViewT<RectView, RNSVG::implementation::RenderableView> {
 public:
  RectView() = default;

  const wchar_t *GetSvgElementName() noexcept override;
  void OnRender(ID2D1SvgDocument& /*document*/ , ID2D1SvgElement & /*element*/) noexcept override;

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;
};

} // namespace winrt::RNSVG::implementation
