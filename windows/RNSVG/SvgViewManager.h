#pragma once

#include "SvgViewManager.g.h"

namespace winrt::RNSVG::implementation {
struct SvgViewManager : SvgViewManagerT<SvgViewManager> {
  SvgViewManager() = default;

  // IViewManager
  hstring Name();
  xaml::FrameworkElement CreateView();

  // IViewManagerWithReactContext
  Microsoft::ReactNative::IReactContext ReactContext();
  void ReactContext(Microsoft::ReactNative::IReactContext const &value);

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
  void UpdateProperties(
      xaml::FrameworkElement const &view,
      Microsoft::ReactNative::IJSValueReader const &propertyMapReader);

  // IViewManagerWithChildren
  void
  AddView(xaml::FrameworkElement const &parent, xaml::UIElement const &child, int64_t index);
  void RemoveAllChildren(xaml::FrameworkElement const &parent);
  void RemoveChildAt(xaml::FrameworkElement const &parent, int64_t index);
  void ReplaceChild(
      xaml::FrameworkElement const &parent,
      xaml::UIElement const &oldChild,
      xaml::UIElement const &newChild);

  // IViewManagerWithPointerEvents
  void OnPointerEvent(
      Windows::Foundation::IInspectable const &view,
      Microsoft::ReactNative::ReactPointerEventArgs const &args);

 private:
  Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct SvgViewManager : SvgViewManagerT<SvgViewManager, implementation::SvgViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
