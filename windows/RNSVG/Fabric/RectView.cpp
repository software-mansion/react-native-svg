#include "pch.h"
#include "RectView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(RectProps)
struct RectProps : winrt::implements<RectProps, winrt::Microsoft::ReactNative::IComponentProps> {
  RectProps(const winrt::Microsoft::ReactNative::ViewProps &props, const winrt::Microsoft::ReactNative::IComponentProps& cloneFrom) REACT_SVG_RENDERABLE_COMMON_PROPS_INIT
  {
    REACT_BEGIN_SVG_RENDERABLE_COMMON_PROPS_CLONE(RectProps)
      x = cloneFromProps->x;
      y = cloneFromProps->y;
      height = cloneFromProps->height;
      width = cloneFromProps->width;
      rx = cloneFromProps->rx;
      ry = cloneFromProps->ry;
    REACT_END_SVG_RENDERABLE_COMMON_PROPS_CLONE
  }

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
    winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
  }

  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(x)
  std::wstring x;
  REACT_FIELD(y)
  std::wstring y;
  REACT_FIELD(height)
  std::wstring height;
  REACT_FIELD(width)
  std::wstring width;
  REACT_FIELD(rx)
  D2D1_SVG_LENGTH rx{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(ry)
  D2D1_SVG_LENGTH ry{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
};

struct RectView : winrt::implements<RectView, winrt::Windows::Foundation::IInspectable, RenderableView> {
 public:
  RectView() = default;

  const wchar_t *GetSvgElementName() noexcept override {
    return L"rect";
  }

  void OnRender(const SvgView &svgView, ID2D1SvgDocument &document, ID2D1SvgElement &element) noexcept override {
    auto props = m_props.as<RectProps>();
    SetCommonSvgProps(svgView, document, element, *props);
    element.SetAttributeValue(
        SvgStrings::xAttributeName,
        D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
        props->x.c_str());
    element.SetAttributeValue(
        SvgStrings::yAttributeName,
        D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
        props->y.c_str());
    element.SetAttributeValue(
        SvgStrings::widthAttributeName,
        D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
        props->width.c_str());
    element.SetAttributeValue(
        SvgStrings::heightAttributeName,
        D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
        props->height.c_str());

    if (props->rx.value)
      element.SetAttributeValue(SvgStrings::rxAttributeName, props->rx);
    if (props->ry.value)
      element.SetAttributeValue(SvgStrings::ryAttributeName, props->ry);
  }
};

void RegisterRectComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<RectProps, RectView>(L"RNSVGRect", builder);
}

} // namespace winrt::RNSVG::implementation
