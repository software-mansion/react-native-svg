#pragma once
#include "EllipseViewManager.g.h"
#include "RenderableViewManager.h"

namespace winrt::RNSVG::implementation {
struct EllipseViewManager : EllipseViewManagerT<EllipseViewManager, RNSVG::implementation::RenderableViewManager> {
  EllipseViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
};
} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation {
struct EllipseViewManager : EllipseViewManagerT<EllipseViewManager, implementation::EllipseViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
