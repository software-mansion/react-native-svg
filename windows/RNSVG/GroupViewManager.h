#pragma once

#include "GroupViewManager.g.h"
#include "RenderableViewManager.h"

namespace winrt::RNSVG::implementation {
struct GroupViewManager : GroupViewManagerT<GroupViewManager, RNSVG::implementation::RenderableViewManager> {
 public:
  GroupViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();

  // IViewManagerWithChildren
  void
  AddView(Windows::UI::Xaml::FrameworkElement const &parent, Windows::UI::Xaml::UIElement const &child, int64_t index);
  void RemoveAllChildren(Windows::UI::Xaml::FrameworkElement const &parent);
  void RemoveChildAt(Windows::UI::Xaml::FrameworkElement const &parent, int64_t index);
  void ReplaceChild(
      Windows::UI::Xaml::FrameworkElement const &parent,
      Windows::UI::Xaml::UIElement const &oldChild,
      Windows::UI::Xaml::UIElement const &newChild);
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct GroupViewManager : GroupViewManagerT<GroupViewManager, implementation::GroupViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
