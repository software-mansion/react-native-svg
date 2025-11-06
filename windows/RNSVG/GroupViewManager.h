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
  void AddView(xaml::FrameworkElement const &parent, xaml::UIElement const &child, int64_t index);
  void RemoveAllChildren(xaml::FrameworkElement const &parent);
  void RemoveChildAt(xaml::FrameworkElement const &parent, int64_t index);
  void ReplaceChild(
      xaml::FrameworkElement const &parent,
      xaml::UIElement const &oldChild,
      xaml::UIElement const &newChild);
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct GroupViewManager : GroupViewManagerT<GroupViewManager, implementation::GroupViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
