#include "pch.h"
#include "RectViewManager.h"
#if __has_include("RectViewManager.g.cpp")
#include "RectViewManager.g.cpp"
#endif

#include "JSValueReader.h"
#include "JSValueXaml.h"

#include <winrt/Windows.UI.Xaml.Media.h>
#include <winrt/Windows.UI.Xaml.Shapes.h>

#include "RectView.h"

using namespace winrt;
using namespace Microsoft::ReactNative;
using namespace Windows::UI::Xaml;
using namespace Windows::UI::Xaml::Controls;
using namespace Windows::UI::Xaml::Media;
using namespace Windows::UI::Xaml::Shapes;

namespace winrt::RNSVG::implementation
{
  // IViewManager
  hstring RectViewManager::Name()
  {
    return L"RNSVGRect";
  }

  FrameworkElement RectViewManager::CreateView()
  {
    return winrt::RNSVG::RectView();
  }

  // IViewManagerWithNativeProperties
  IMapView<hstring, ViewManagerPropertyType> RectViewManager::NativeProps()
  {
    auto nativeProps = winrt::single_threaded_map<hstring, ViewManagerPropertyType>();

    nativeProps.Insert(L"fill", ViewManagerPropertyType::Number);
    nativeProps.Insert(L"height", ViewManagerPropertyType::Number);
    nativeProps.Insert(L"width", ViewManagerPropertyType::Number);
    nativeProps.Insert(L"x", ViewManagerPropertyType::Number);
    nativeProps.Insert(L"y", ViewManagerPropertyType::Number);
    nativeProps.Insert(L"rx", ViewManagerPropertyType::Number);
    nativeProps.Insert(L"ry", ViewManagerPropertyType::Number);
    nativeProps.Insert(L"stroke", ViewManagerPropertyType::Number);
    nativeProps.Insert(L"strokeWidth", ViewManagerPropertyType::Number);

    return nativeProps.GetView();
  }

  void RectViewManager::UpdateProperties(FrameworkElement const &view, IJSValueReader const &propertyMapReader)
  {
    if (auto rectView = view.try_as<RectView>())
    {
      rectView->UpdateProperties(propertyMapReader);
    }
  }

} // namespace winrt::RNSVG::implementation
