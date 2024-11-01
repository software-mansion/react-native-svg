#include "pch.h"
#include "EllipseView.h"

namespace winrt::RNSVG::implementation {

EllipseProps::EllipseProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void EllipseProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

const wchar_t *EllipseView::GetSvgElementName() noexcept {
  return L"ellipse";
}

void EllipseView::OnRender(ID2D1SvgDocument & /* document*/, ID2D1SvgElement &svgElement) noexcept {
  auto props = m_props.as<EllipseProps>();
	svgElement.SetAttributeValue(SvgStrings::cxAttributeName, props->cx);
	svgElement.SetAttributeValue(SvgStrings::cyAttributeName, props->cy);
	svgElement.SetAttributeValue(SvgStrings::rxAttributeName, props->rx);
	svgElement.SetAttributeValue(SvgStrings::ryAttributeName, props->ry);
}

void EllipseView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::EllipseProps, EllipseView>(L"RNSVGEllipse", builder);
}

} // namespace winrt::RNSVG::implementation
