#include "pch.h"

#include "JSValueXaml.h"

#include "GroupView.h"
#if __has_include("GroupView.g.cpp")
#include "GroupView.g.cpp"
#endif

#include "../SVGLength.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
SvgGroupCommonProps::SvgGroupCommonProps(
    const winrt::Microsoft::ReactNative::ViewProps &props)
    : base_type(props) {}

void SvgGroupCommonProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

const wchar_t* GroupView::GetSvgElementName() noexcept
{
  return L"g";
}

void GroupView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::SvgGroupCommonProps, GroupView>(L"RNSVGGroup", builder);
}

} // namespace winrt::RNSVG::implementation
