#include "pch.h"
#include "PathView.h"

#include "d2d1svg.h"

namespace winrt::RNSVG::implementation {

PathProps::PathProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void PathProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

const wchar_t *PathView::GetSvgElementName() noexcept {
  return L"path";
}

void PathView::OnRender(ID2D1SvgDocument & /*document*/, ID2D1SvgElement &svgElement) noexcept {
  auto props = m_props.as<PathProps>();
	svgElement.SetAttributeValue(SvgStrings::dAttributeName, D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, props->d.c_str());
}

void PathView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::PathProps, PathView>(L"RNSVGPath", builder);
}

} // namespace winrt::RNSVG::implementation
