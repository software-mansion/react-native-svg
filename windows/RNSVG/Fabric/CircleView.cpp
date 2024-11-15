#include "pch.h"
#include "CircleView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(CircleProps)
struct CircleProps : public winrt::implements<CircleProps, winrt::Microsoft::ReactNative::IComponentProps> {
  CircleProps(const winrt::Microsoft::ReactNative::ViewProps &props, const winrt::Microsoft::ReactNative::IComponentProps& cloneFrom) REACT_SVG_RENDERABLE_COMMON_PROPS_INIT
  {
  REACT_BEGIN_SVG_RENDERABLE_COMMON_PROPS_CLONE(CircleProps)
    r = cloneFromProps->r;
    cx = cloneFromProps->cx;
    cy = cloneFromProps->cy;
  REACT_END_SVG_RENDERABLE_COMMON_PROPS_CLONE
  }

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
    winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
  }

  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(r)
  D2D1_SVG_LENGTH r{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(cx)
  D2D1_SVG_LENGTH cx{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(cy)
  D2D1_SVG_LENGTH cy{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
};

struct CircleView : winrt::implements<CircleView, winrt::Windows::Foundation::IInspectable, RenderableView> {
 public:
  CircleView() = default;

  const wchar_t *GetSvgElementName() noexcept override {
    return L"circle";
  }
  void OnRender(const SvgView &svgView, ID2D1SvgDocument &document, ID2D1SvgElement &element) noexcept override {
    auto props = winrt::get_self<CircleProps>(m_props);

    SetCommonSvgProps(svgView, document, element, *props);

    element.SetAttributeValue(SvgStrings::cxAttributeName, props->cx);
    element.SetAttributeValue(SvgStrings::cyAttributeName, props->cy);
    element.SetAttributeValue(SvgStrings::rAttributeName, props->r);
  }
};

void RegisterCircleComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::CircleProps, CircleView>(L"RNSVGCircle", builder);
}

} // namespace winrt::RNSVG::implementation
