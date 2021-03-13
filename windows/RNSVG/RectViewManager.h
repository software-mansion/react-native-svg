#pragma once

#include "RectViewManager.g.h"

namespace winrt::RNSVG::implementation
{
  struct RectViewManager : RectViewManagerT<RectViewManager>
  {
    RectViewManager() = default;

    // IViewManager
    hstring Name();
    Windows::UI::Xaml::FrameworkElement CreateView();

    // IViewManagerWithNativeProperties
    Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
    void UpdateProperties(
        Windows::UI::Xaml::FrameworkElement const &view,
        Microsoft::ReactNative::IJSValueReader const &propertyMapReader);
  };
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation
{
  struct RectViewManager : RectViewManagerT<RectViewManager, implementation::RectViewManager>
  {
  };
} // namespace winrt::RNSVG::factory_implementation
