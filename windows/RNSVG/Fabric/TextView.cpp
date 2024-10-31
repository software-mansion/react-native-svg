#include "pch.h"
#include "TextView.h"
#if __has_include("TextView.g.cpp")
#include "TextView.g.cpp"
#endif

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {

SvgTextCommonProps::SvgTextCommonProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void SvgTextCommonProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

const wchar_t *TextView::GetSvgElementName() noexcept {
  return L"text";
}

bool TextView::IsSupported() const noexcept {
  return false;
}

void TextView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::SvgTextCommonProps, TextView>(L"RNSVGText", builder);
}

} // namespace winrt::RNSVG::implementation
