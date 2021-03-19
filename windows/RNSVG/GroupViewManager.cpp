#include "pch.h"
#include "GroupViewManager.h"
#if __has_include("GroupViewManager.g.cpp")
#include "GroupViewManager.g.cpp"
#endif

#include "GroupView.h"

#include <winrt/Windows.UI.Xaml.Shapes.h>

using namespace winrt;
using namespace Microsoft::ReactNative;

using namespace Windows::Foundation;
using namespace Windows::Foundation::Collections;

using namespace Windows::UI::Xaml;
using namespace Windows::UI::Xaml::Controls;
using namespace Windows::UI::Xaml::Shapes;

namespace winrt::RNSVG::implementation
{
  // IViewManager
  hstring GroupViewManager::Name()
  {
    return L"RNSVGGroup";
  }

  FrameworkElement GroupViewManager::CreateView()
  {
    return winrt::RNSVG::GroupView(m_reactContext);
  }

  // IViewManagerWithContext
  IReactContext GroupViewManager::ReactContext()
  {
    return m_reactContext;
  }

  void GroupViewManager::ReactContext(IReactContext const &reactContext)
  {
    m_reactContext = reactContext;
  }

  // IViewManagerWithNativeProperties
  IMapView<hstring, ViewManagerPropertyType> GroupViewManager::NativeProps()
  {
    auto nativeProps = winrt::single_threaded_map<hstring, ViewManagerPropertyType>();

    nativeProps.Insert(L"fill", ViewManagerPropertyType::Number);
    nativeProps.Insert(L"height", ViewManagerPropertyType::Number);
    nativeProps.Insert(L"width", ViewManagerPropertyType::Number);

    return nativeProps.GetView();
  }

  void GroupViewManager::UpdateProperties(FrameworkElement const &view, IJSValueReader const &propertyMapReader)
  {
    if (auto groupView{view.try_as<RNSVG::GroupView>()})
    {
      groupView.UpdateProperties(propertyMapReader);
    }
  }

  // IViewManagerWithChildren
  void GroupViewManager::AddView(FrameworkElement const &parent, UIElement const &child, int64_t /*index*/)
  {
    if (auto groupView{parent.try_as<RNSVG::GroupView>()})
    {
      if (auto childView{child.try_as<RNSVG::RenderableView>()})
      {
        groupView.Children().Append(childView);
        childView.SvgParent(parent);
      }
    }
  }

  void GroupViewManager::RemoveAllChildren(FrameworkElement const &parent)
  {
    if (auto groupView{parent.try_as<RNSVG::GroupView>()})
    {
      for (auto child : groupView.Children())
      {
        child.SvgParent(nullptr);
      }

      groupView.Children().Clear();
    }
  }

  void GroupViewManager::RemoveChildAt(FrameworkElement const &parent, int64_t index)
  {
    if (auto groupView{parent.try_as<RNSVG::GroupView>()})
    {
      auto child{groupView.Children().GetAt(static_cast<uint32_t>(index))};
      child.SvgParent(nullptr);

      groupView.Children().RemoveAt(static_cast<uint32_t>(index));
    }
  }

  void
  GroupViewManager::ReplaceChild(FrameworkElement const &parent, UIElement const &oldChild, UIElement const &newChild)
  {
    auto groupView{parent.try_as<RNSVG::GroupView>()};
    auto oldChildView{oldChild.try_as<RNSVG::RenderableView>()};
    auto newChildView{newChild.try_as<RNSVG::RenderableView>()};

    if (groupView && oldChildView && newChildView)
    {
      uint32_t index;

      if (groupView.Children().IndexOf(oldChildView, index))
      {
        groupView.Children().SetAt(index, newChildView);
        oldChildView.SvgParent(nullptr);
        newChildView.SvgParent(parent);
      }
    }
  }
} // namespace winrt::RNSVG::implementation
