#include "pch.h"
#include "MarkerView.h"
#if __has_include("MarkerView.g.cpp")
#include "MarkerView.g.cpp"
#endif

using namespace winrt;

namespace winrt::RNSVG::implementation {

MarkerProps::MarkerProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void MarkerProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

const wchar_t *MarkerView::GetSvgElementName() noexcept {
  return L"marker";
}

bool MarkerView::IsSupported() const noexcept {
  return false;
}

void MarkerView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::MarkerProps, MarkerView>(L"RNSVGMarker", builder);
}

} // namespace winrt::RNSVG::implementation
