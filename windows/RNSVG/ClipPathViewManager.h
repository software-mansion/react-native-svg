#pragma once
#include "ClipPathViewManager.g.h"
#include "GroupViewManager.h"

namespace winrt::RNSVG::implementation {
struct ClipPathViewManager : ClipPathViewManagerT<ClipPathViewManager, RNSVG::implementation::GroupViewManager> {
  ClipPathViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct ClipPathViewManager : ClipPathViewManagerT<ClipPathViewManager, implementation::ClipPathViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
