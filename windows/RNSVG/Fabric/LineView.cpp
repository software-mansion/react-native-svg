#include "pch.h"
#include "LineView.h"
#if __has_include("LineView.g.cpp")
#include "LineView.g.cpp"
#endif

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {

LineProps::LineProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void LineProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

const wchar_t *LineView::GetSvgElementName() noexcept {
  return L"line";
}

void LineView::OnRender(ID2D1SvgDocument & /*document*/, ID2D1SvgElement &svgElement) noexcept {
  auto props = m_props.as<LineProps>();
	svgElement.SetAttributeValue(SvgStrings::x1AttributeName, props->x1);
	svgElement.SetAttributeValue(SvgStrings::y1AttributeName, props->y1);
	svgElement.SetAttributeValue(SvgStrings::x2AttributeName, props->x2);
	svgElement.SetAttributeValue(SvgStrings::y2AttributeName, props->y2);
}

void LineView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::LineProps, LineView>(L"RNSVGLine", builder);
}

} // namespace winrt::RNSVG::implementation
