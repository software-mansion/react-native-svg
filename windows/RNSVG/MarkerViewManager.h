#pragma once
#include "MarkerViewManager.g.h"
#include "GroupViewManager.h"

namespace winrt::RNSVG::implementation {
struct MarkerViewManager : MarkerViewManagerT<MarkerViewManager, RNSVG::implementation::GroupViewManager> {
  MarkerViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct MarkerViewManager : MarkerViewManagerT<MarkerViewManager, implementation::MarkerViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
