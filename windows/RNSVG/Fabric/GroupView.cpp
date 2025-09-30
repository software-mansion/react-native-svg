#include "pch.h"

#include "GroupView.h"

#include "RenderableView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(SvgGroupProps)
struct SvgGroupProps : winrt::implements<SvgGroupProps, winrt::Microsoft::ReactNative::IComponentProps> {
  SvgGroupProps(const winrt::Microsoft::ReactNative::ViewProps &props, const winrt::Microsoft::ReactNative::IComponentProps& cloneFrom) REACT_SVG_RENDERABLE_COMMON_PROPS_INIT 
  {
    REACT_BEGIN_SVG_RENDERABLE_COMMON_PROPS_CLONE(SvgGroupProps)
    REACT_END_SVG_RENDERABLE_COMMON_PROPS_CLONE
  }

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
    winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
  }

  REACT_SVG_RENDERABLE_COMMON_PROPS;
};

struct GroupView : winrt::implements<GroupView, winrt::Windows::Foundation::IInspectable, RenderableView> {
 public:
  GroupView() = default;

  const wchar_t *GetSvgElementName() noexcept override {
    return L"g";
  }

  void OnRender(const SvgView &svgView, ID2D1SvgDocument &document, ID2D1SvgElement &element) noexcept override {
    auto props = winrt::get_self<SvgGroupProps>(m_props);
    SetCommonSvgProps(svgView, document, element, *props);
  }
};

void RegisterGroupComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<SvgGroupProps, GroupView>(L"RNSVGGroup", builder);
}

} // namespace winrt::RNSVG::implementation
