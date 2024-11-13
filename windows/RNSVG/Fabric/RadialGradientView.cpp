#include "pch.h"
#include "RadialGradientView.h"

namespace winrt::RNSVG::implementation {

struct SvgRadialGradientStop {
  float offset{0};
  D2D1_COLOR_F color;
  float opacity{1.0f};
};

REACT_STRUCT(RadialGradientProps)
struct RadialGradientProps : winrt::implements<RadialGradientProps, winrt::Microsoft::ReactNative::IComponentProps> {
  RadialGradientProps(const winrt::Microsoft::ReactNative::ViewProps &props, const winrt::Microsoft::ReactNative::IComponentProps& cloneFrom) REACT_SVG_RENDERABLE_COMMON_PROPS_INIT
  {
    REACT_BEGIN_SVG_RENDERABLE_COMMON_PROPS_CLONE(RadialGradientProps)
      fx = cloneFromProps->fx;
      fy = cloneFromProps->fy;
      cx = cloneFromProps->cx;
      cy = cloneFromProps->cy;
      rx = cloneFromProps->rx;
      ry = cloneFromProps->ry;
      gradient = cloneFromProps->gradient;
      gradientUnits = cloneFromProps->gradientUnits;
      gradientTransform = cloneFromProps->gradientTransform;
    REACT_END_SVG_RENDERABLE_COMMON_PROPS_CLONE
  }

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
    winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
  }

  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(fx)
  std::optional<std::wstring> fx;
  REACT_FIELD(fy)
  std::optional<std::wstring> fy;
  REACT_FIELD(cx)
  std::optional<std::wstring> cx;
  REACT_FIELD(cy)
  std::optional<std::wstring> cy;
  REACT_FIELD(rx)
  std::optional<std::wstring> rx;
  REACT_FIELD(ry)
  std::optional<std::wstring> ry;
  REACT_FIELD(gradient)
  std::optional<std::vector<float>> gradient{};
  REACT_FIELD(gradientUnits)
  std::optional<int32_t> gradientUnits;
  REACT_FIELD(gradientTransform)
  std::optional<std::vector<float>> gradientTransform;
};

struct RadialGradientView : winrt::implements<RadialGradientView, winrt::Windows::Foundation::IInspectable, RenderableView> {
 public:
  RadialGradientView() = default;

  void UpdateProps(
      const winrt::Microsoft::ReactNative::ComponentView &view,
      const winrt::Microsoft::ReactNative::IComponentProps &newProps,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps) noexcept override {
    auto props = newProps.as<RadialGradientProps>();
    m_stops.clear();

    if (props->gradient) {
      auto it = props->gradient->begin();
      while (it != props->gradient->end()) {
        SvgRadialGradientStop stop;

        stop.offset = *it;
        ++it;
        auto clr = static_cast<uint32_t>(*it);
        stop.color = D2D1_COLOR_F{
            ((clr & 0x00FF0000) >> 16) / 255.0f,
            ((clr & 0x0000FF00) >> 8) / 255.0f,
            (clr & 0x000000FF) / 255.0f,
            ((clr & 0xFF000000) >> 24) / 255.0f};
        stop.opacity = ((clr & 0xFF000000) >> 24) / 255.0f;
        ++it;
        m_stops.push_back(stop);
      }
    }

    RenderableView::UpdateProps(view, newProps, oldProps);
  }

  const wchar_t *GetSvgElementName() noexcept override {
    return L"radialGradient";
  }

  void OnRender(const SvgView &svgView, ID2D1SvgDocument &document, ID2D1SvgElement &element) noexcept override {
    auto props = m_props.as<RadialGradientProps>();
    SetCommonSvgProps(svgView, document, element, *props);
    if (props->cx)
      element.SetAttributeValue(
          SvgStrings::cxAttributeName,
          D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
          props->cx->c_str());
    if (props->cy)
      element.SetAttributeValue(
          SvgStrings::cyAttributeName,
          D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
          props->cy->c_str());

    // RNSVG can decompose r to rx and ry, but D2D svgs don't support rx or ry, so if that is specified then take rx as
    // r, and make sure the specified rx and ry are the same.
    assert(props->rx == props->ry);

    if (props->rx)
      element.SetAttributeValue(
          SvgStrings::rAttributeName,
          D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
          props->rx->c_str());

    if (props->fx)
      element.SetAttributeValue(
          SvgStrings::fxAttributeName,
          D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
          props->fx->c_str());

    if (props->fy)
      element.SetAttributeValue(
          SvgStrings::fyAttributeName,
          D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
          props->fy->c_str());

    if (props->gradientUnits.value_or(0) == 0) {
      element.SetAttributeValue(
          SvgStrings::gradientUnitsAttributeName, D2D1_SVG_UNIT_TYPE::D2D1_SVG_UNIT_TYPE_OBJECT_BOUNDING_BOX);
    } else {
      element.SetAttributeValue(
          SvgStrings::gradientUnitsAttributeName, D2D1_SVG_UNIT_TYPE::D2D1_SVG_UNIT_TYPE_USER_SPACE_ON_USE);
    }

    if (props->gradientTransform) {
      auto &matrix = props->gradientTransform.value();
      element.SetAttributeValue(
          SvgStrings::gradientTransformAttributeName,
          D2D1_MATRIX_3X2_F{matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]});
    }

    for (const auto &stop : m_stops) {
      winrt::com_ptr<ID2D1SvgElement> svgStop;
      element.CreateChild(SvgStrings::stopAttributeName, svgStop.put());
      svgStop->SetAttributeValue(SvgStrings::offsetAttributeName, stop.offset);
      svgStop->SetAttributeValue(SvgStrings::stopColorAttributeName, stop.color);
      svgStop->SetAttributeValue(SvgStrings::stopOpacityAttributeName, stop.opacity);
    }
  }

 private:
  std::vector<SvgRadialGradientStop> m_stops;
};

void RegisterRadialGradientComponent(
    const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<RadialGradientProps, RadialGradientView>(L"RNSVGRadialGradient", builder);
}

} // namespace winrt::RNSVG::implementation
