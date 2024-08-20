#include "pch.h"
#include "MaskView.h"
#if __has_include("MaskView.g.cpp")
#include "MaskView.g.cpp"
#endif

using namespace winrt;

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
MaskProps::MaskProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void MaskProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

MaskView::MaskView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) : base_type(args) {}

void MaskView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  builder.AddViewComponent(
      L"RNSVGMask", [](winrt::Microsoft::ReactNative::IReactViewComponentBuilder const &builder) noexcept {
        builder.SetCreateProps([](winrt::Microsoft::ReactNative::ViewProps props) noexcept {
          return winrt::make<winrt::RNSVG::implementation::MaskProps>(props);
        });
        builder.SetCreateComponentView([](const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) noexcept {
          return winrt::make<winrt::RNSVG::implementation::MaskView>(args);
        });
      });
}

void MaskView::UpdateProperties(
    const winrt::Microsoft::ReactNative::IComponentProps &props,
    const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
    bool forceUpdate,
    bool invalidate) noexcept {
  auto maskProps = props.try_as<MaskProps>();
  if (maskProps) {
    m_props = maskProps;
  }

  base_type::UpdateProperties(props, oldProps, forceUpdate, invalidate);
}
#else
#endif

} // namespace winrt::RNSVG::implementation
