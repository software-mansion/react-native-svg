#pragma once
#include "ImageViewManager.g.h"
#include "RenderableViewManager.h"

namespace winrt::RNSVG::implementation {
struct ImageViewManager : ImageViewManagerT<ImageViewManager, RNSVG::implementation::RenderableViewManager> {
  ImageViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct ImageViewManager : ImageViewManagerT<ImageViewManager, implementation::ImageViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
