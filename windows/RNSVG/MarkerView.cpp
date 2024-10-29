#include "pch.h"
#include "MarkerView.h"
#if __has_include("MarkerView.g.cpp")
#include "MarkerView.g.cpp"
#endif

using namespace winrt;

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
MarkerProps::MarkerProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void MarkerProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

void MarkerView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::MarkerProps, MarkerView>(L"RNSVGMarker", builder);
}

void MarkerView::UpdateProperties(
    const winrt::Microsoft::ReactNative::IComponentProps &props,
    const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
    bool forceUpdate,
    bool invalidate) noexcept {
  auto markerProps = props.try_as<MarkerProps>();
  if (markerProps) {
  }

  base_type::UpdateProperties(props, oldProps, forceUpdate, invalidate);
}
#else
#endif

} // namespace winrt::RNSVG::implementation
