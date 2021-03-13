#include "pch.h"

#include "JSValueXaml.h"

#include "GroupView.h"
#if __has_include("GroupView.g.cpp")
#include "GroupView.g.cpp"
#endif

#include <winrt/Windows.UI.Xaml.Media.h>

namespace winrt::RNSVG::implementation
{
  GroupView::GroupView(Microsoft::ReactNative::IReactContext const &context) : m_reactContext(context)
  {
    Background(winrt::Windows::UI::Xaml::Media::SolidColorBrush{winrt::Windows::UI::Colors::Pink()});
  }

  void GroupView::UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader)
  {
    auto const &propertyMap = Microsoft::ReactNative::JSValueObject::ReadFrom(reader);

    for (auto const &pair : propertyMap)
    {
      auto const &propertyName = pair.first;
      auto const &propertyValue = pair.second;

      if (propertyName == "width")
      {
        Width(propertyValue.AsDouble());
      } else if (propertyName == "height")
      {
        Height(propertyValue.AsDouble());
      }
    }
  }

  winrt::Windows::Foundation::Size GroupView::MeasureOverride(winrt::Windows::Foundation::Size availableSize)
  {
    if (auto parent = Parent().try_as<winrt::Windows::UI::Xaml::FrameworkElement>())
    {
      return winrt::Windows::UI::Xaml::SizeHelper::FromDimensions(
          static_cast<float>(parent.Width()), static_cast<float>(parent.Height()));

      // return { parent.Width(), parent.Height() };
    }
    return availableSize;
  }

  winrt::Windows::Foundation::Size GroupView::ArrangeOverride(winrt::Windows::Foundation::Size finalSize)
  {
    return finalSize;
  }
} // namespace winrt::RNSVG::implementation
