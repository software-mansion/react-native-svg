#include "pch.h"
#include "UseView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(UseProps)
struct UseProps : winrt::implements<UseProps, winrt::Microsoft::ReactNative::IComponentProps> {
  UseProps(const winrt::Microsoft::ReactNative::ViewProps &props, const winrt::Microsoft::ReactNative::IComponentProps& cloneFrom) REACT_SVG_RENDERABLE_COMMON_PROPS_INIT
  {
    REACT_BEGIN_SVG_RENDERABLE_COMMON_PROPS_CLONE(UseProps)
      href = cloneFromProps->href;
      x = cloneFromProps->x;
      y = cloneFromProps->y;
      width = cloneFromProps->width;
      height = cloneFromProps->height;
    REACT_END_SVG_RENDERABLE_COMMON_PROPS_CLONE
  }

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
    winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
  }

  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(href)
  std::wstring href;
  REACT_FIELD(x)
  D2D1_SVG_LENGTH x{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(y)
  D2D1_SVG_LENGTH y{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(width)
  D2D1_SVG_LENGTH width{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(height)
  D2D1_SVG_LENGTH height{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
};

struct UseView : winrt::implements<UseView, winrt::Windows::Foundation::IInspectable, RenderableView> {
 public:
  UseView() = default;

  const wchar_t *GetSvgElementName() noexcept override {
    return L"use";
  }

  void OnRender(const SvgView &svgView, ID2D1SvgDocument &document, ID2D1SvgElement &element) noexcept override {
    auto props = m_props.as<UseProps>();
    SetCommonSvgProps(svgView, document, element, *props);
    element.SetAttributeValue(
        SvgStrings::xlinkhrefAttributeName,
        D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
        (L"#" + props->href).c_str());

    element.SetAttributeValue(SvgStrings::xAttributeName, props->x);
    element.SetAttributeValue(SvgStrings::yAttributeName, props->y);
    element.SetAttributeValue(SvgStrings::widthAttributeName, props->width);
    element.SetAttributeValue(SvgStrings::heightAttributeName, props->height);
  }
};

void RegisterUseComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<UseProps, UseView>(L"RNSVGUse", builder);
}

} // namespace winrt::RNSVG::implementation
