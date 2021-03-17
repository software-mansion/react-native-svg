#pragma once

#include "GroupViewManager.g.h"

namespace winrt::RNSVG::implementation
{
  struct GroupViewManager : GroupViewManagerT<GroupViewManager>
  {
    GroupViewManager() = default;

    // IViewManager
    hstring Name();
    Windows::UI::Xaml::FrameworkElement CreateView();

    // IViewManagerWithReactContext
    Microsoft::ReactNative::IReactContext ReactContext();
    void ReactContext(Microsoft::ReactNative::IReactContext const &value);

    // IViewManagerWithNativeProperties
    Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
    void UpdateProperties(
        Windows::UI::Xaml::FrameworkElement const &view,
        Microsoft::ReactNative::IJSValueReader const &propertyMapReader);

    // IViewManagerWithChildren
    void AddView(
        Windows::UI::Xaml::FrameworkElement const &parent,
        Windows::UI::Xaml::UIElement const &child,
        int64_t index);
    void RemoveAllChildren(Windows::UI::Xaml::FrameworkElement const &parent);
    void RemoveChildAt(Windows::UI::Xaml::FrameworkElement const &parent, int64_t index);
    void ReplaceChild(
        Windows::UI::Xaml::FrameworkElement const &parent,
        Windows::UI::Xaml::UIElement const &oldChild,
        Windows::UI::Xaml::UIElement const &newChild);

    // IViewManagerRequiresNativeLayout
    bool RequiresNativeLayout() { return true; }

   private:
    Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
  };
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation
{
  struct GroupViewManager : GroupViewManagerT<GroupViewManager, implementation::GroupViewManager>
  {
  };
} // namespace winrt::RNSVG::factory_implementation
