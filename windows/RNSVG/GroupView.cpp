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
    Width(100);
    Height(100);
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

  void GroupView::AddChild(RenderableView const &child)
  {
    //child.SetParent();
    m_children.push_back(child);
  }

  winrt::Windows::Foundation::Size GroupView::MeasureOverride(winrt::Windows::Foundation::Size availableSize)
  {
    if (auto parent = Parent().try_as<winrt::Windows::UI::Xaml::FrameworkElement>())
    {
      for (auto child : Children())
      {
        child.Measure(availableSize);
      }

      winrt::Size parentSize{static_cast<float>(parent.Width()), static_cast<float>(parent.Height())};
      return winrt::Windows::UI::Xaml::SizeHelper::FromDimensions(
          static_cast<float>(parent.Width()), static_cast<float>(parent.Height()));

      // return { parent.Width(), parent.Height() };
    }
    return availableSize;
  }

  winrt::Windows::Foundation::Size GroupView::ArrangeOverride(winrt::Windows::Foundation::Size finalSize)
  {
    for (auto child : Children())
    {
      child.Arrange({0, 0, finalSize.Width, finalSize.Height});
    }

    return finalSize;
  }

  void GroupView::DrawChildren(Microsoft::Graphics::Canvas::CanvasDrawingSession const &session)
  {
    for (auto child : m_children)
    {
        child.Render(session);
      //session.DrawRectangle(50, 50, 100, 100, winrt::Windows::UI::Colors::Blue());
    }
  }

  void GroupView::InvalidateCanvas()
  {
    if(auto parent{m_parent.get()})
    {
      parent->InvalidateCanvas();
    }
  }
} // namespace winrt::RNSVG::implementation
