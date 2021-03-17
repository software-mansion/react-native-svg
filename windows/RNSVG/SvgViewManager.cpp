#include "pch.h"
#include "SvgViewManager.h"
#if __has_include("SvgViewManager.g.cpp")
#include "SvgViewManager.g.cpp"
#endif

#include <winrt/Windows.UI.Xaml.Media.h>
#include <winrt/Windows.UI.Xaml.Shapes.h>

#include "SvgView.h"

namespace winrt
{
  using namespace Windows::Foundation::Collections;
  using namespace Microsoft::Graphics::Canvas::UI::Xaml;
  using namespace Microsoft::ReactNative;
  using namespace Windows::UI::Xaml;
  using namespace Windows::UI::Xaml::Controls;
} // namespace winrt

namespace winrt::RNSVG::implementation
{
  // IViewManager
  hstring SvgViewManager::Name()
  {
    return L"RNSVGSvgView";
  }

  FrameworkElement SvgViewManager::CreateView()
  {
    return winrt::RNSVG::SvgView(m_reactContext);
  }

  // IViewManagerWithContext
  IReactContext SvgViewManager::ReactContext()
  {
    return m_reactContext;
  }

  void SvgViewManager::ReactContext(IReactContext const &reactContext)
  {
    m_reactContext = reactContext;
  }

  // IViewManagerWithNativeProperties
  IMapView<hstring, ViewManagerPropertyType> SvgViewManager::NativeProps()
  {
    auto nativeProps = winrt::single_threaded_map<hstring, ViewManagerPropertyType>();

    nativeProps.Insert(L"height", ViewManagerPropertyType::Number);
    nativeProps.Insert(L"width", ViewManagerPropertyType::Number);

    return nativeProps.GetView();
  }

  void SvgViewManager::UpdateProperties(FrameworkElement const &view, IJSValueReader const &propertyMapReader)
  {
    if (auto svgView = view.try_as<SvgView>())
    {
      svgView->UpdateProperties(propertyMapReader);
    }
  }

  // IViewManagerWithChildren
  void SvgViewManager::AddView(FrameworkElement const &parent, UIElement const &child, int64_t /*index*/)
  {
    if (auto const &view = parent.try_as<SvgView>())
    {
      view->AddGroup(child);
      //view.Children().Append(child);
    }
  }

  void SvgViewManager::RemoveAllChildren(FrameworkElement const &parent)
  {
    if (auto const &view = parent.try_as<Panel>())
    {
      view.Children().Clear();
    }
  }

  void SvgViewManager::RemoveChildAt(FrameworkElement const &parent, int64_t index)
  {
    if (auto const &view = parent.try_as<Panel>())
    {
      view.Children().RemoveAt(static_cast<uint32_t>(index));
    }
  }

  void SvgViewManager::ReplaceChild(FrameworkElement const &parent, UIElement const &oldChild, UIElement const &newChild)
  {
    if (auto const &view = parent.try_as<Panel>())
    {
      uint32_t index;

      if (view.Children().IndexOf(oldChild, index))
      {
        view.Children().SetAt(index, newChild);
      }
    }
  }
} // namespace winrt::RNSVG::implementation
