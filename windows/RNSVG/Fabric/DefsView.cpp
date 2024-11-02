#include "pch.h"
#include "DefsView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(DefsProps)
struct DefsProps : winrt::implements<DefsProps, winrt::Microsoft::ReactNative::IComponentProps> {
  DefsProps(const winrt::Microsoft::ReactNative::ViewProps &props) REACT_SVG_GROUP_COMMON_PROPS_INIT {}

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
    winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
  }

  REACT_SVG_GROUP_COMMON_PROPS;
};

struct DefsView : winrt::implements<DefsView, IInspectable, RenderableView> {
 public:
  DefsView() = default;

  const wchar_t *GetSvgElementName() noexcept override {
    return L"defs";
  }

  void OnRender(const SvgView &svgView, ID2D1SvgDocument &document, ID2D1SvgElement &element) noexcept override {
    if (m_props) {
      auto props = winrt::get_self<DefsProps>(m_props);
      SetCommonSvgProps(svgView, document, element, *props);
    }
  }
};

void RegisterDefsComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<DefsProps, DefsView>(L"RNSVGDefs", builder);
}

} // namespace winrt::RNSVG::implementation
