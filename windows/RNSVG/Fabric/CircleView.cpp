#include "pch.h"
#include "CircleView.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {

CircleProps::CircleProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void CircleProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

const wchar_t *CircleView::GetSvgElementName() noexcept {
  return L"circle";
}

void CircleView::OnRender(ID2D1SvgDocument & /*document*/, ID2D1SvgElement &svgElement) noexcept {
  auto props = m_props.as<CircleProps>();
  svgElement.SetAttributeValue(SvgStrings::cxAttributeName, props->cx);
  svgElement.SetAttributeValue(SvgStrings::cyAttributeName, props->cy);
  svgElement.SetAttributeValue(SvgStrings::rAttributeName, props->r);
}

void CircleView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::CircleProps, CircleView>(L"RNSVGCircle", builder);
}

} // namespace winrt::RNSVG::implementation
