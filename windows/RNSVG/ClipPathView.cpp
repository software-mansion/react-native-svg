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

ClipPathView::ClipPathView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) : base_type(args) {}

void ClipPathView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  builder.AddViewComponent(
      L"RNSVGClipPath", [](winrt::Microsoft::ReactNative::IReactViewComponentBuilder const &builder) noexcept {
        builder.SetCreateProps([](winrt::Microsoft::ReactNative::ViewProps props) noexcept {
          return winrt::make<winrt::RNSVG::implementation::ClipPathProps>(props);
        });
        builder.SetCreateComponentView([](const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) noexcept {
          return winrt::make<winrt::RNSVG::implementation::ClipPathView>(args);
        });
      });
}
#endif
} // namespace winrt::RNSVG::implementation
