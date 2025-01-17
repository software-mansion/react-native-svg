#include "pch.h"
#include "EllipseView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(EllipseProps)
struct EllipseProps : winrt::implements<EllipseProps, winrt::Microsoft::ReactNative::IComponentProps> {
  EllipseProps(const winrt::Microsoft::ReactNative::ViewProps &props, const winrt::Microsoft::ReactNative::IComponentProps& cloneFrom) REACT_SVG_RENDERABLE_COMMON_PROPS_INIT
  {
    REACT_BEGIN_SVG_RENDERABLE_COMMON_PROPS_CLONE(EllipseProps)
      cx = cloneFromProps->cx;
      cy = cloneFromProps->cy;
      rx = cloneFromProps->rx;
      ry = cloneFromProps->ry;
    REACT_END_SVG_RENDERABLE_COMMON_PROPS_CLONE
  }

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
    winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
  }

  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(cx)
  D2D1_SVG_LENGTH cx{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(cy)
  D2D1_SVG_LENGTH cy{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(rx)
  D2D1_SVG_LENGTH rx{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(ry)
  D2D1_SVG_LENGTH ry{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
};

struct EllipseView : winrt::implements<EllipseView, winrt::Windows::Foundation::IInspectable, RenderableView> {
 public:
  EllipseView() = default;

  const wchar_t *GetSvgElementName() noexcept override {
    return L"ellipse";
  }

  void OnRender(const SvgView &svgView, ID2D1SvgDocument &document, ID2D1SvgElement &element) noexcept override {
    auto props = m_props.as<EllipseProps>();
    SetCommonSvgProps(svgView, document, element, *props);
    element.SetAttributeValue(SvgStrings::cxAttributeName, props->cx);
    element.SetAttributeValue(SvgStrings::cyAttributeName, props->cy);
    element.SetAttributeValue(SvgStrings::rxAttributeName, props->rx);
    element.SetAttributeValue(SvgStrings::ryAttributeName, props->ry);
  }
};

void RegisterEllipseComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<EllipseProps, EllipseView>(L"RNSVGEllipse", builder);
}

} // namespace winrt::RNSVG::implementation
