#include "pch.h"
#include "ClipPathView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(ClipPathProps)
struct ClipPathProps : winrt::implements<ClipPathProps, winrt::Microsoft::ReactNative::IComponentProps> {
  ClipPathProps(const winrt::Microsoft::ReactNative::ViewProps &props) REACT_SVG_GROUP_COMMON_PROPS_INIT {}

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
    winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
  }

  REACT_SVG_GROUP_COMMON_PROPS;
};

struct ClipPathView : winrt::implements<ClipPathView, IInspectable, RenderableView> {
 public:
  ClipPathView() = default;

  void OnRender(const SvgView &svgView, ID2D1SvgDocument &document, ID2D1SvgElement &element) noexcept override {
    auto props = winrt::get_self<ClipPathProps>(m_props);
    SetCommonSvgProps(svgView, document, element, *props);
  }

  const wchar_t *GetSvgElementName() noexcept override {
    return L"clipPath";
  }
};

void RegisterClipPathComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::ClipPathProps, ClipPathView>(L"RNSVGClipPath", builder);
}

} // namespace winrt::RNSVG::implementation