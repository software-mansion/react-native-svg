#include "pch.h"
#include "ClipPathView.h"
#if __has_include("ClipPathView.g.cpp")
#include "ClipPathView.g.cpp"
#endif

using namespace winrt;

namespace winrt::RNSVG::implementation {
#ifdef USE_FABRIC
ClipPathProps::ClipPathProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void ClipPathProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

void ClipPathView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::ClipPathProps, ClipPathView>(L"RNSVGClipPath", builder);
}
#endif
} // namespace winrt::RNSVG::implementation
