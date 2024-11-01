#include "pch.h"
#include "ClipPathView.h"

namespace winrt::RNSVG::implementation {

ClipPathProps::ClipPathProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void ClipPathProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

const wchar_t *ClipPathView::GetSvgElementName() noexcept {
  return L"clipPath";
}

void ClipPathView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::ClipPathProps, ClipPathView>(L"RNSVGClipPath", builder);
}

} // namespace winrt::RNSVG::implementation
