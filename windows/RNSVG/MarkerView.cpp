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

MarkerView::MarkerView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) : base_type(args) {}

void MarkerView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  builder.AddViewComponent(
      L"RNSVGMarker", [](winrt::Microsoft::ReactNative::IReactViewComponentBuilder const &builder) noexcept {
        builder.SetCreateProps([](winrt::Microsoft::ReactNative::ViewProps props) noexcept {
          return winrt::make<winrt::RNSVG::implementation::MarkerProps>(props);
        });
        builder.SetCreateComponentView([](const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) noexcept {
          return winrt::make<winrt::RNSVG::implementation::MarkerView>(args);
        });
      });
}

void MarkerView::UpdateProperties(
    const winrt::Microsoft::ReactNative::IComponentProps &props,
    const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
    bool forceUpdate,
    bool invalidate) noexcept {
  auto markerProps = props.try_as<MarkerProps>();
  if (markerProps) {
    m_props = markerProps;
  }

  base_type::UpdateProperties(props, oldProps, forceUpdate, invalidate);
}
#else
#endif

} // namespace winrt::RNSVG::implementation
