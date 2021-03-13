#include "pch.h"

#include "JSValueXaml.h"

#include "SvgView.h"
#if __has_include("SvgView.g.cpp")
#include "SvgView.g.cpp"
#endif

#include <winrt/Windows.UI.Xaml.Media.h>

namespace winrt::RNSVG::implementation
{
  SvgView::SvgView(Microsoft::ReactNative::IReactContext const &context) : m_reactContext(context)
  {
    Background(winrt::Windows::UI::Xaml::Media::SolidColorBrush{winrt::Windows::UI::Colors::Yellow()});
  }

  void SvgView::UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader)
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

  winrt::Windows::Foundation::Size SvgView::MeasureOverride(winrt::Windows::Foundation::Size availableSize)
  {
    return availableSize;
  }

  winrt::Windows::Foundation::Size SvgView::ArrangeOverride(winrt::Windows::Foundation::Size finalSize)
  {
    return finalSize;
  }
} // namespace winrt::RNSVG::implementation
