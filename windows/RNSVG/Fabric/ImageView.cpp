#include "pch.h"
#include "ImageView.h"
#if __has_include("ImageView.g.cpp")
#include "ImageView.g.cpp"
#endif

#ifndef USE_FABRIC
#include <wincodec.h>
#endif

using namespace winrt::Microsoft::ReactNative;
using namespace winrt::Windows::Security::Cryptography;
using namespace winrt::Windows::Storage::Streams;
using namespace winrt::Windows::Web::Http;

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
