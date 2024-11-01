#pragma once

#include "SvgTextCommonProps.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {

#define REACT_SVG_TEXT_COMMON_PROPS \
  REACT_FIELD(dx)                   \
  REACT_FIELD(dy)                   \
  REACT_FIELD(x)                    \
  REACT_FIELD(y)                    \
  REACT_FIELD(rotate)               \
  REACT_FIELD(inlineSize)           \
  REACT_FIELD(textLength)           \
  REACT_FIELD(baselineShift)        \
  REACT_FIELD(lengthAdjust)         \
  REACT_FIELD(alignmentBaseline)    \
  REACT_FIELD(verticalAlign)           

REACT_STRUCT(SvgTextCommonProps)
struct SvgTextCommonProps : SvgTextCommonPropsT<SvgTextCommonProps, SvgGroupCommonProps> {
  SvgTextCommonProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;
  REACT_SVG_GROUP_COMMON_PROPS;
  REACT_SVG_TEXT_COMMON_PROPS;

  std::optional<std::vector<RNSVG::SVGLength>> dx;
  std::optional<std::vector<RNSVG::SVGLength>> dy;
  std::optional<std::vector<RNSVG::SVGLength>> x;
  std::optional<std::vector<RNSVG::SVGLength>> y;
  std::optional<std::vector<RNSVG::SVGLength>> rotate;
  RNSVG::SVGLength inlineSize{0, winrt::RNSVG::LengthType::Unknown};
  RNSVG::SVGLength textLength{0, winrt::RNSVG::LengthType::Unknown};
  RNSVG::SVGLength baselineShift{0, winrt::RNSVG::LengthType::Unknown};
  std::string lengthAdjust;
  std::string alignmentBaseline;
  RNSVG::SVGLength verticalAlign{0, winrt::RNSVG::LengthType::Unknown};
};

struct TextView : winrt::implements<TextView, IInspectable, RenderableView> {
 public:
  TextView() = default;

  const wchar_t *GetSvgElementName() noexcept override;
  bool IsSupported() const noexcept override;

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;
};

} // namespace winrt::RNSVG::implementation
