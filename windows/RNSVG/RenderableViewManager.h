#pragma once

#include "RenderableViewManager.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {
struct RenderableViewManager : RenderableViewManagerT<RenderableViewManager> {
 public:
  RenderableViewManager() = default;

  // IViewManager
  hstring Name() { return m_name; }
  Windows::UI::Xaml::FrameworkElement CreateView();

  // IViewManagerWithReactContext
  Microsoft::ReactNative::IReactContext ReactContext() { return m_reactContext; }
  void ReactContext(Microsoft::ReactNative::IReactContext const &value) { m_reactContext = value; }

  // IViewManagerWithNativeProperties
  void UpdateProperties(
      Windows::UI::Xaml::FrameworkElement const &view,
      Microsoft::ReactNative::IJSValueReader const &propertyMapReader);
  virtual
    Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();

 protected:
  Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
  RNSVG::SVGClass m_class{RNSVG::SVGClass::Unknown};
  hstring m_name{};
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct RenderableViewManager : RenderableViewManagerT<RenderableViewManager, implementation::RenderableViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
