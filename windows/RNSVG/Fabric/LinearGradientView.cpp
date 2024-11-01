#include "pch.h"
#include "LinearGradientView.h"

namespace winrt::RNSVG::implementation {

LinearGradientProps::LinearGradientProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void LinearGradientProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}



void LinearGradientView::UpdateProps(
    const winrt::Microsoft::ReactNative::ComponentView &view,
    const winrt::Microsoft::ReactNative::IComponentProps &newProps,
    const winrt::Microsoft::ReactNative::IComponentProps &oldProps) noexcept {
  auto props = newProps.as<LinearGradientProps>();
  m_stops.clear();

  if (props->gradient) {
    auto it = props->gradient->begin();
    while (it != props->gradient->end()) {
      SvgLinearGradientStop stop;

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
  RenderableView::UpdateProps(view, newProps, oldProps);
}


const wchar_t *LinearGradientView::GetSvgElementName() noexcept {
  return L"linearGradient";
}

void LinearGradientView::OnRender(ID2D1SvgDocument & /*document*/, ID2D1SvgElement &svgElement) noexcept {
  auto props = m_props.as<LinearGradientProps>();
	if (props->x1)
		svgElement.SetAttributeValue(SvgStrings::x1AttributeName, D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, props->x1.value().c_str());
	if (props->y1)
		svgElement.SetAttributeValue(SvgStrings::y1AttributeName, D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, props->y1.value().c_str());
	if (props->x2)
		svgElement.SetAttributeValue(SvgStrings::x2AttributeName, D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, props->x2.value().c_str());
	if (props->y2)
		svgElement.SetAttributeValue(SvgStrings::y2AttributeName, D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, props->y2.value().c_str());


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

  for (const auto &stop : m_stops) {
    winrt::com_ptr<ID2D1SvgElement> svgStop;
    svgElement.CreateChild(SvgStrings::stopAttributeName, svgStop.put());
    svgStop->SetAttributeValue(SvgStrings::offsetAttributeName, stop.offset);
    svgStop->SetAttributeValue(SvgStrings::stopColorAttributeName, stop.color);
    svgStop->SetAttributeValue(SvgStrings::stopOpacityAttributeName, stop.opacity);
  }
}

void LinearGradientView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::LinearGradientProps, LinearGradientView>(
      L"RNSVGLinearGradient", builder);
}

} // namespace winrt::RNSVG::implementation
