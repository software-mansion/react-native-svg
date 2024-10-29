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

void DefsView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::DefsProps, DefsView>(L"RNSVGDefs", builder);
}
#endif

void DefsView::Draw(RNSVG::D2DDeviceContext const& /*deviceContext*/, Size const & /*size*/) {}
} // namespace winrt::RNSVG::implementation
