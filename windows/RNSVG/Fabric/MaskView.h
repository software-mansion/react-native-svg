#pragma once

#include "MaskProps.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(MaskProps)
struct MaskProps : MaskPropsT<MaskProps, SvgGroupCommonProps> {
  MaskProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(x)
  RNSVG::SVGLength x{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(y)
  RNSVG::SVGLength y{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(height)
  RNSVG::SVGLength height{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(width)
  RNSVG::SVGLength width{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(maskUnits)
  uint32_t maskUnits{0};
  REACT_FIELD(maskContentUnits)
  uint32_t maskContentUnits{0};
};

struct MaskView : winrt::implements<MaskView, IInspectable, RenderableView> {
 public:
  MaskView() = default;

  const wchar_t *GetSvgElementName() noexcept override;
  bool IsSupported() const noexcept override;

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;
};

} // namespace winrt::RNSVG::implementation
