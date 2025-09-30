#pragma once
#include "LinearGradientViewManager.g.h"
#include "GroupViewManager.h"

namespace winrt::RNSVG::implementation {
struct LinearGradientViewManager
    : LinearGradientViewManagerT<LinearGradientViewManager, RNSVG::implementation::GroupViewManager> {
  LinearGradientViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct LinearGradientViewManager
    : LinearGradientViewManagerT<LinearGradientViewManager, implementation::LinearGradientViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
