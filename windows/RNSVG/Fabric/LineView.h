#pragma once

#include "LineProps.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(LineProps)
struct LineProps : LinePropsT<LineProps, SvgRenderableCommonProps> {
  LineProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(x1)
  D2D1_SVG_LENGTH x1{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(y1)
  D2D1_SVG_LENGTH y1{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(x2)
  D2D1_SVG_LENGTH x2{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(y2)
  D2D1_SVG_LENGTH y2{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
};

struct LineView : winrt::implements<LineView, IInspectable, RenderableView> {
 public:
  LineView() = default;

  const wchar_t *GetSvgElementName() noexcept override;
  void OnRender(ID2D1SvgDocument & /*document*/, ID2D1SvgElement & /*element*/) noexcept override;

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;

};

} // namespace winrt::RNSVG::implementation
