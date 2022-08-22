#pragma once
#include "LineViewManager.g.h"
#include "RenderableViewManager.h"

namespace winrt::RNSVG::implementation {
struct LineViewManager : LineViewManagerT<LineViewManager, RNSVG::implementation::RenderableViewManager> {
  LineViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
};
} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation {
struct LineViewManager : LineViewManagerT<LineViewManager, implementation::LineViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
