#pragma once
#include "RadialGradientViewManager.g.h"
#include "GroupViewManager.h"

namespace winrt::RNSVG::implementation {
struct RadialGradientViewManager
    : RadialGradientViewManagerT<RadialGradientViewManager, RNSVG::implementation::GroupViewManager> {
  RadialGradientViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct RadialGradientViewManager
    : RadialGradientViewManagerT<RadialGradientViewManager, implementation::RadialGradientViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
