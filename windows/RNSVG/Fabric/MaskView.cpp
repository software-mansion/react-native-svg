#include "pch.h"
#include "MaskView.h"

namespace winrt::RNSVG::implementation {

MaskProps::MaskProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void MaskProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

const wchar_t *MaskView::GetSvgElementName() noexcept {
  return L"mask";
}

bool MaskView::IsSupported() const noexcept {
  return false;
}

void MaskView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::MaskProps, MaskView>(L"RNSVGMask", builder);
}

} // namespace winrt::RNSVG::implementation
