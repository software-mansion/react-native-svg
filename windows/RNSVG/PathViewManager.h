#pragma once

#include "PathViewManager.g.h"
#include "RenderableViewManager.h"

namespace winrt::RNSVG::implementation {
struct PathViewManager : PathViewManagerT<PathViewManager, RNSVG::implementation::RenderableViewManager> {
  PathViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct PathViewManager : PathViewManagerT<PathViewManager, implementation::PathViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
