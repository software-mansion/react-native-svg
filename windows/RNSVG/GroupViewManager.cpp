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
    if (auto groupView = view.try_as<GroupView>())
    {
      groupView->UpdateProperties(propertyMapReader);
    }
  }

  // IViewManagerWithChildren
  void GroupViewManager::AddView(FrameworkElement const &parent, UIElement const &child, int64_t /*index*/)
  {
    if (auto groupView = parent.try_as<GroupView>())
    {
      if (auto childView = child.try_as<RenderableView>())
      {
        
        groupView->Children().Append(child);
      }
    }
  }

  void GroupViewManager::RemoveAllChildren(FrameworkElement const &parent)
  {
    if (auto groupView = parent.try_as<GroupView>())
    {
      groupView->Children().Clear();
    }
  }

  void GroupViewManager::RemoveChildAt(FrameworkElement const &parent, int64_t index)
  {
    if (auto groupView = parent.try_as<GroupView>())
    {
      groupView->Children().RemoveAt(static_cast<uint32_t>(index));
    }
  }

  void
  GroupViewManager::ReplaceChild(FrameworkElement const &parent, UIElement const &oldChild, UIElement const &newChild)
  {
    if (auto groupView = parent.try_as<GroupView>())
    {
      uint32_t index;

      if (groupView->Children().IndexOf(oldChild, index))
      {
        groupView->Children().SetAt(index, newChild);
      }
    }
  }
} // namespace winrt::RNSVG::implementation
