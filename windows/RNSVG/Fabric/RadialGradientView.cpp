#include "pch.h"
#include "RadialGradientView.h"
#if __has_include("RadialGradientView.g.cpp")
#include "RadialGradientView.g.cpp"
#endif

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {

RadialGradientProps::RadialGradientProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void RadialGradientProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

void RadialGradientView::UpdateProps(
      const winrt::Microsoft::ReactNative::ComponentView & view,
      const winrt::Microsoft::ReactNative::IComponentProps &newProps,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps) noexcept {

  auto props = newProps.as<RadialGradientProps>();
  m_stops.clear();
  
  if (props->gradient) {
    auto it = props->gradient->begin();
    while (it != props->gradient->end()) {
      SvgRadialGradientStop stop;

      stop.offset = it->AsSingle();
      ++it;
      auto clr = it->AsUInt32();
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

  base_type::UpdateProps(view, newProps, oldProps);
}

const wchar_t *RadialGradientView::GetSvgElementName() noexcept {
  return L"radialGradient";
}

void RadialGradientView::OnRender(ID2D1SvgDocument & /*document*/, ID2D1SvgElement &svgElement) noexcept {
  auto props = m_props.as<RadialGradientProps>();
  if (props->cx)
    svgElement.SetAttributeValue(
        SvgStrings::cxAttributeName,
        D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
        props->cx->c_str());
  if (props->cy)
    svgElement.SetAttributeValue(
        SvgStrings::cyAttributeName,
        D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
        props->cy->c_str());

  // RNSVG can decompose r to rx and ry, but D2D svgs don't support rx or ry, so if that is specified then take rx as r,
  // and make sure the specified rx and ry are the same.
  assert(props->rx == props->ry);

  // TODO verify rx ry comment above

  if (props->rx)
    svgElement.SetAttributeValue(
        SvgStrings::rAttributeName,
        D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
        props->rx->c_str());

  if (props->fx)
    svgElement.SetAttributeValue(
        SvgStrings::fxAttributeName,
        D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
        props->fx->c_str());

  if (props->fy)
    svgElement.SetAttributeValue(
        SvgStrings::fyAttributeName,
        D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
        props->fy->c_str());

  if (props->gradientUnits.value_or(0) == 0) {
    svgElement.SetAttributeValue(
        SvgStrings::gradientUnitsAttributeName, D2D1_SVG_UNIT_TYPE::D2D1_SVG_UNIT_TYPE_OBJECT_BOUNDING_BOX);
  } else {
    svgElement.SetAttributeValue(
        SvgStrings::gradientUnitsAttributeName, D2D1_SVG_UNIT_TYPE::D2D1_SVG_UNIT_TYPE_USER_SPACE_ON_USE);
  }

  if (props->gradientTransform) {
    auto &matrix = props->gradientTransform.value();
    svgElement.SetAttributeValue(
        SvgStrings::gradientTransformAttributeName,
        D2D1_MATRIX_3X2_F{matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]});
  }

  for (const auto& stop : m_stops ) {
    winrt::com_ptr<ID2D1SvgElement> svgStop;
    svgElement.CreateChild(SvgStrings::stopAttributeName, svgStop.put());
    svgStop->SetAttributeValue(SvgStrings::offsetAttributeName, stop.offset);
    svgStop->SetAttributeValue(SvgStrings::stopColorAttributeName, stop.color);
    svgStop->SetAttributeValue(SvgStrings::stopOpacityAttributeName, stop.opacity);
  }
}

void RadialGradientView::RegisterComponent(
    const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::RadialGradientProps, RadialGradientView>(
      L"RNSVGRadialGradient", builder);
}

} // namespace winrt::RNSVG::implementation
