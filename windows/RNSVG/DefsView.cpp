#include "pch.h"
#include "DefsView.h"
#if __has_include("DefsView.g.cpp")
#include "DefsView.g.cpp"
#endif

using namespace winrt;

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
DefsProps::DefsProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void DefsProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

DefsView::DefsView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) : base_type(args) {}

void DefsView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  builder.AddViewComponent(
      L"RNSVGDefs", [](winrt::Microsoft::ReactNative::IReactViewComponentBuilder const &builder) noexcept {
        builder.SetCreateProps([](winrt::Microsoft::ReactNative::ViewProps props) noexcept {
          return winrt::make<winrt::RNSVG::implementation::DefsProps>(props);
        });
        builder.SetCreateComponentView([](const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) noexcept {
          return winrt::make<winrt::RNSVG::implementation::DefsView>(args);
        });
      });
}
#endif

void DefsView::Draw(RNSVG::D2DDeviceContext const& /*deviceContext*/, Size const & /*size*/) {}
} // namespace winrt::RNSVG::implementation
