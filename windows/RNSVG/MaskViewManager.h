#pragma once
#include "MaskViewManager.g.h"
#include "GroupViewManager.h"

namespace winrt::RNSVG::implementation {
struct MaskViewManager : MaskViewManagerT<MaskViewManager, RNSVG::implementation::GroupViewManager> {
  MaskViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct MaskViewManager : MaskViewManagerT<MaskViewManager, implementation::MaskViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
