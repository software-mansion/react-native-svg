#pragma once

#include "TSpanProps.g.h"
#include "TextView.h"

namespace winrt::RNSVG::implementation {
  
REACT_STRUCT(TSpanProps)
struct TSpanProps : TSpanPropsT<TSpanProps, SvgTextCommonProps> {
  TSpanProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;
  REACT_SVG_GROUP_COMMON_PROPS;
  REACT_SVG_TEXT_COMMON_PROPS;

  REACT_FIELD(content)
  std::string content{""};
};

struct TSpanView : winrt::implements<TSpanView, IInspectable, RenderableView> {
public:
  TSpanView() = default;

  const wchar_t *GetSvgElementName() noexcept override;
  bool IsSupported() const noexcept override;

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;
};

} // namespace winrt::RNSVG::implementation

