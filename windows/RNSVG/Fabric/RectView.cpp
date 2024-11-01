#include "pch.h"
#include "RectView.h"

namespace winrt::RNSVG::implementation {

RectProps::RectProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void RectProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

const wchar_t *RectView::GetSvgElementName() noexcept {
  return L"rect";
}

void RectView::OnRender(ID2D1SvgDocument & /*document*/, ID2D1SvgElement &svgElement) noexcept {
  auto props = m_props.as<RectProps>();
  svgElement.SetAttributeValue(
      SvgStrings::xAttributeName, D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, props->x.c_str());
  svgElement.SetAttributeValue(
      SvgStrings::yAttributeName, D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, props->y.c_str());
  svgElement.SetAttributeValue(
      SvgStrings::widthAttributeName,
      D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
      props->width.c_str());
  svgElement.SetAttributeValue(
      SvgStrings::heightAttributeName,
      D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
      props->height.c_str());

  if (props->rx.value)
    svgElement.SetAttributeValue(SvgStrings::rxAttributeName, props->rx);
  if (props->ry.value)
    svgElement.SetAttributeValue(SvgStrings::ryAttributeName, props->ry);
}

void RectView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::RectProps, RectView>(L"RNSVGRect", builder);
}

} // namespace winrt::RNSVG::implementation
