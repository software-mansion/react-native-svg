#pragma once
#include "CircleViewManager.g.h"
#include "RenderableViewManager.h"

namespace winrt::RNSVG::implementation {
struct CircleViewManager : CircleViewManagerT<CircleViewManager, RNSVG::implementation::RenderableViewManager> {
  CircleViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
};
} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation {
struct CircleViewManager : CircleViewManagerT<CircleViewManager, implementation::CircleViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
