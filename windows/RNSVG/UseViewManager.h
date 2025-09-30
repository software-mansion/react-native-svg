#pragma once
#include "UseViewManager.g.h"
#include "RenderableViewManager.h"

namespace winrt::RNSVG::implementation {
struct UseViewManager : UseViewManagerT<UseViewManager, RNSVG::implementation::RenderableViewManager> {
  UseViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct UseViewManager : UseViewManagerT<UseViewManager, implementation::UseViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
