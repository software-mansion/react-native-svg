#pragma once

#include "EllipseProps.g.h"
#include "EllipseView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(EllipseProps)
struct EllipseProps : EllipsePropsT<EllipseProps, SvgRenderableCommonProps> {
  EllipseProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(cx)
  D2D1_SVG_LENGTH cx{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(cy)
  D2D1_SVG_LENGTH cy{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(rx)
  D2D1_SVG_LENGTH rx{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(ry)
  D2D1_SVG_LENGTH ry{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
};

struct EllipseView : EllipseViewT<EllipseView, RNSVG::implementation::RenderableView> {
 public:
  EllipseView() = default;

  const wchar_t *GetSvgElementName() noexcept override;
  void OnRender(ID2D1SvgDocument & /*document*/, ID2D1SvgElement & /*element*/) noexcept override;

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;
};

} // namespace winrt::RNSVG::implementation

