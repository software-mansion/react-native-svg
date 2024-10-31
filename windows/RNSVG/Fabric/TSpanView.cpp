#include "pch.h"
#include "TSpanView.h"
#if __has_include("TSpanView.g.cpp")
#include "TSpanView.g.cpp"
#endif

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {

TSpanProps::TSpanProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void TSpanProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

const wchar_t *TSpanView::GetSvgElementName() noexcept {
  return L"tSpan";
}

bool TSpanView::IsSupported() const noexcept {
  return false;
}

void TSpanView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::TSpanProps, TSpanView>(L"RNSVGTSpan", builder);
}

} // namespace winrt::RNSVG::implementation
