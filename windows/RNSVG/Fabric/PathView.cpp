#include "pch.h"
#include "PathView.h"

#include "d2d1svg.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(PathProps)
struct PathProps : winrt::implements<PathProps, winrt::Microsoft::ReactNative::IComponentProps> {
  PathProps(const winrt::Microsoft::ReactNative::ViewProps &props, const winrt::Microsoft::ReactNative::IComponentProps& cloneFrom) REACT_SVG_RENDERABLE_COMMON_PROPS_INIT
  {
    REACT_BEGIN_SVG_RENDERABLE_COMMON_PROPS_CLONE(PathProps)
      d = cloneFromProps->d;
    REACT_END_SVG_RENDERABLE_COMMON_PROPS_CLONE
  }

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
    winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
  }

  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(d)
  std::wstring d;
};

struct PathView : winrt::implements<PathView, winrt::Windows::Foundation::IInspectable, RenderableView> {
 public:
  PathView() = default;

  const wchar_t *GetSvgElementName() noexcept override {
    return L"path";
  }

  void OnRender(const SvgView &svgView, ID2D1SvgDocument &document, ID2D1SvgElement &element) noexcept override {
    auto props = m_props.as<PathProps>();
    SetCommonSvgProps(svgView, document, element, *props);
    element.SetAttributeValue(
        SvgStrings::dAttributeName,
        D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
        props->d.c_str());
  }
};

void RegisterPathComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<PathProps, PathView>(L"RNSVGPath", builder);
}

} // namespace winrt::RNSVG::implementation
