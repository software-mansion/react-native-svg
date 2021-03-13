#include "pch.h"
#include "RectViewManager.h"
#if __has_include("RectViewManager.g.cpp")
#include "RectViewManager.g.cpp"
#endif

#include "JSValueReader.h"
#include "JSValueXaml.h"

#include <winrt/Windows.UI.Xaml.Media.h>
#include <winrt/Windows.UI.Xaml.Shapes.h>

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
    winrt::Windows::UI::Xaml::Shapes::Rectangle view{};
    view.Fill(winrt::Windows::UI::Xaml::Media::SolidColorBrush{winrt::Windows::UI::Colors::Blue()});
    return view;
  }

  // IViewManagerWithNativeProperties
  IMapView<hstring, ViewManagerPropertyType> RectViewManager::NativeProps()
  {
    auto nativeProps = winrt::single_threaded_map<hstring, ViewManagerPropertyType>();

    nativeProps.Insert(L"fill", ViewManagerPropertyType::Color);
    nativeProps.Insert(L"height", ViewManagerPropertyType::Number);
    nativeProps.Insert(L"width", ViewManagerPropertyType::Number);

    return nativeProps.GetView();
  }

  void RectViewManager::UpdateProperties(FrameworkElement const &view, IJSValueReader const &propertyMapReader)
  {
    if (auto rect = view.try_as<winrt::Windows::UI::Xaml::Shapes::Rectangle>())
    {
      const JSValueObject &propertyMap = JSValue::ReadObjectFrom(propertyMapReader);
      // auto const &propertyMap = Microsoft::ReactNative::JSValueObject::ReadFrom(propertyMapReader);

      for (auto const &pair : propertyMap)
      {
        auto const &propertyName = pair.first;
        auto const &propertyValue = pair.second;

        if (propertyName == "width")
        {
          rect.Width(propertyValue.AsDouble());
        } else if (propertyName == "height")
        {
          rect.Height(propertyValue.AsDouble());
        } else if (propertyName == "fill")
        {
          if (auto value = propertyValue.To<Brush>())
          {
            rect.SetValue(Shape::FillProperty(), value);
          }
        }
      }
    }
  }

} // namespace winrt::RNSVG::implementation
