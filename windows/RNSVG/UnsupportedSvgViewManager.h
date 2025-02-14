#pragma once

#include "UnsupportedSvgViewManager.g.h"

namespace winrt::RNSVG::implementation {
struct UnsupportedSvgViewManager : UnsupportedSvgViewManagerT<UnsupportedSvgViewManager> {
  UnsupportedSvgViewManager() = default;
  UnsupportedSvgViewManager(hstring name);

  // IViewManager
  hstring Name();
  xaml::FrameworkElement CreateView();

  // IViewManagerWithReactContext
  Microsoft::ReactNative::IReactContext ReactContext();
  void ReactContext(Microsoft::ReactNative::IReactContext const &value);

  // IViewManagerWithChildren
  void AddView(xaml::FrameworkElement const &parent, xaml::UIElement const &child, int64_t index);
  void RemoveAllChildren(xaml::FrameworkElement const &parent);
  void RemoveChildAt(xaml::FrameworkElement const &parent, int64_t index);
  void
  ReplaceChild(xaml::FrameworkElement const &parent, xaml::UIElement const &oldChild, xaml::UIElement const &newChild);

 private:
  hstring m_name{L"RNSVGUnsupportedSvgView"};
  Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct UnsupportedSvgViewManager : UnsupportedSvgViewManagerT<UnsupportedSvgViewManager, implementation::UnsupportedSvgViewManager> {};
} // namespace winrt::RNSVG::factory_implementation