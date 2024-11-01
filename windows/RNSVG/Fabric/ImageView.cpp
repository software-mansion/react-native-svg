#include "pch.h"
#include "ImageView.h"

namespace winrt::RNSVG::implementation {

ImageProps::ImageProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void ImageProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

const wchar_t *ImageView::GetSvgElementName() noexcept {
  return L"image";
}

bool ImageView::IsSupported() const noexcept {
  return false;
}

void ImageView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::ImageProps, ImageView>(L"RNSVGImage", builder);
}

} // namespace winrt::RNSVG::implementation
