#include "pch.h"
#include "PatternView.h"

namespace winrt::RNSVG::implementation {

PatternProps::PatternProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void PatternProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

const wchar_t *PatternView::GetSvgElementName() noexcept {
  return L"pattern";
}

bool PatternView::IsSupported() const noexcept {
  return false;
}

void PatternView::RegisterComponent(
    const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::PatternProps, PatternView>(L"RNSVGPattern", builder);
}

} // namespace winrt::RNSVG::implementation
