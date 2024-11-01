#include "pch.h"
#include "UseView.h"

namespace winrt::RNSVG::implementation {

UseProps::UseProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void UseProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

const wchar_t *UseView::GetSvgElementName() noexcept {
  return L"use";
}

void UseView::OnRender(ID2D1SvgDocument & /*document*/, ID2D1SvgElement &svgElement) noexcept {
  auto props = m_props.as<UseProps>();
  svgElement.SetAttributeValue(
      SvgStrings::xlinkhrefAttributeName,
      D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
      (L"#" + props->href).c_str());

  svgElement.SetAttributeValue(SvgStrings::xAttributeName, props->x);
  svgElement.SetAttributeValue(SvgStrings::yAttributeName, props->y);
  svgElement.SetAttributeValue(SvgStrings::widthAttributeName, props->width);
  svgElement.SetAttributeValue(SvgStrings::heightAttributeName, props->height);
}

void UseView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::UseProps, UseView>(L"RNSVGUse", builder);
}

} // namespace winrt::RNSVG::implementation
