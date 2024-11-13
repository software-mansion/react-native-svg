#include "pch.h"
#include "LinearGradientView.h"

namespace winrt::RNSVG::implementation {

struct SvgLinearGradientStop {
  float offset{0};
  D2D1_COLOR_F color;
  float opacity{1.0f};
};

REACT_STRUCT(LinearGradientProps)
struct LinearGradientProps : winrt::implements<LinearGradientProps, winrt::Microsoft::ReactNative::IComponentProps> {
  LinearGradientProps(const winrt::Microsoft::ReactNative::ViewProps &props, const winrt::Microsoft::ReactNative::IComponentProps& cloneFrom) REACT_SVG_RENDERABLE_COMMON_PROPS_INIT
  {
    REACT_BEGIN_SVG_RENDERABLE_COMMON_PROPS_CLONE(LinearGradientProps)
      x1 = cloneFromProps->x1;
      y1 = cloneFromProps->y1;
      x2 = cloneFromProps->x2;
      y2 = cloneFromProps->y2;
      gradient = cloneFromProps->gradient;
      gradientUnits = cloneFromProps->gradientUnits;
      gradientTransform = cloneFromProps->gradientTransform;
    REACT_END_SVG_RENDERABLE_COMMON_PROPS_CLONE
  }

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
    winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
  }

  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(x1)
  std::optional<std::wstring> x1;
  REACT_FIELD(y1)
  std::optional<std::wstring> y1;
  REACT_FIELD(x2)
  std::optional<std::wstring> x2;
  REACT_FIELD(y2)
  std::optional<std::wstring> y2;
  REACT_FIELD(gradient)
  std::optional<std::vector<float>> gradient{};
  REACT_FIELD(gradientUnits)
  std::optional<int32_t> gradientUnits;
  REACT_FIELD(gradientTransform)
  std::optional<std::vector<float>> gradientTransform;
};

struct LinearGradientView : winrt::implements<LinearGradientView, winrt::Windows::Foundation::IInspectable, RenderableView> {
 public:
  LinearGradientView() = default;

  void UpdateProps(
      const winrt::Microsoft::ReactNative::ComponentView &view,
      const winrt::Microsoft::ReactNative::IComponentProps &newProps,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps) noexcept override {
    auto props = newProps.as<LinearGradientProps>();
    m_stops.clear();

    if (props->gradient) {
      auto it = props->gradient->begin();
      while (it != props->gradient->end()) {
        SvgLinearGradientStop stop;

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
    return L"linearGradient";
  }

  void OnRender(const SvgView &svgView, ID2D1SvgDocument &document, ID2D1SvgElement &element) noexcept override {
    auto props = m_props.as<LinearGradientProps>();
    SetCommonSvgProps(svgView, document, element, *props);
    if (props->x1)
      element.SetAttributeValue(
          SvgStrings::x1AttributeName, D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, props->x1.value().c_str());
    if (props->y1)
      element.SetAttributeValue(
          SvgStrings::y1AttributeName, D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, props->y1.value().c_str());
    if (props->x2)
      element.SetAttributeValue(
          SvgStrings::x2AttributeName, D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, props->x2.value().c_str());
    if (props->y2)
      element.SetAttributeValue(
          SvgStrings::y2AttributeName, D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, props->y2.value().c_str());

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
  std::vector<SvgLinearGradientStop> m_stops;
};

void RegisterLinearGradientComponent(
    const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<LinearGradientProps, LinearGradientView>(L"RNSVGLinearGradient", builder);
}

} // namespace winrt::RNSVG::implementation
