#include "pch.h"
#include "LineView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(LineProps)
struct LineProps : winrt::implements<LineProps, winrt::Microsoft::ReactNative::IComponentProps> {
  LineProps(const winrt::Microsoft::ReactNative::ViewProps &props, const winrt::Microsoft::ReactNative::IComponentProps& cloneFrom) REACT_SVG_RENDERABLE_COMMON_PROPS_INIT
  {
    REACT_BEGIN_SVG_RENDERABLE_COMMON_PROPS_CLONE(LineProps)
      x1 = cloneFromProps->x1;
      y1 = cloneFromProps->y1;
      x2 = cloneFromProps->x2;
      y2 = cloneFromProps->y2;
    REACT_END_SVG_RENDERABLE_COMMON_PROPS_CLONE
  }

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
    winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
  }

  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(x1)
  D2D1_SVG_LENGTH x1{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(y1)
  D2D1_SVG_LENGTH y1{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(x2)
  D2D1_SVG_LENGTH x2{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
  REACT_FIELD(y2)
  D2D1_SVG_LENGTH y2{0, D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER};
};

struct LineView : winrt::implements<LineView, winrt::Windows::Foundation::IInspectable, RenderableView> {
 public:
  LineView() = default;

  const wchar_t *GetSvgElementName() noexcept override {
    return L"line";
  }

  void OnRender(const SvgView &svgView, ID2D1SvgDocument &document, ID2D1SvgElement &element) noexcept override {
    auto props = m_props.as<LineProps>();
    SetCommonSvgProps(svgView, document, element, *props);
    element.SetAttributeValue(SvgStrings::x1AttributeName, props->x1);
    element.SetAttributeValue(SvgStrings::y1AttributeName, props->y1);
    element.SetAttributeValue(SvgStrings::x2AttributeName, props->x2);
    element.SetAttributeValue(SvgStrings::y2AttributeName, props->y2);
  }
};

void RegisterLineComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<LineProps, LineView>(L"RNSVGLine", builder);
}

} // namespace winrt::RNSVG::implementation
