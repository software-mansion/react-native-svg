#include "pch.h"
#include "SymbolView.h"
#if __has_include("SymbolView.g.cpp")
#include "SymbolView.g.cpp"
#endif

using namespace winrt;

namespace winrt::RNSVG::implementation {

SymbolProps::SymbolProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void SymbolProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

const wchar_t *SymbolView::GetSvgElementName() noexcept {
  return L"symbol";
}

bool SymbolView::IsSupported() const noexcept {
  return false;
}

void SymbolView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::SymbolProps, SymbolView>(L"RNSVGSymbol", builder);
}

} // namespace winrt::RNSVG::implementation
