#pragma once

#include "RectViewManager.g.h"
#include "RenderableViewManager.h"

namespace winrt::RNSVG::implementation {
struct RectViewManager : RectViewManagerT<RectViewManager, RNSVG::implementation::RenderableViewManager> {
  RectViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct RectViewManager : RectViewManagerT<RectViewManager, implementation::RectViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
