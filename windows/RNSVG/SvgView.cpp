#include "pch.h"

#include "JSValueXaml.h"

#include "SvgView.h"
#if __has_include("SvgView.g.cpp")
#include "SvgView.g.cpp"
#endif

#include <winrt/Windows.UI.Xaml.Media.h>
#include <winrt/Windows.UI.Xaml.Shapes.h>

#include "GroupView.h"

namespace winrt::RNSVG::implementation
{
  SvgView::SvgView(Microsoft::ReactNative::IReactContext const &context) : m_reactContext(context)
  {
    Background(winrt::Windows::UI::Xaml::Media::SolidColorBrush{winrt::Windows::UI::Colors::LightGray()});
    m_canvas.Draw({get_weak(), &SvgView::Canvas_Draw});
    Children().Append(m_canvas);
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
      }
      else if (propertyName == "height")
      {
        Height(propertyValue.AsDouble());
      }
      else if (propertyName == "opacity")
      {
        if (propertyValue.IsNull())
        {
          m_opacity = 1.0f;
        } else
        {
          m_opacity = propertyValue.AsSingle();
        }
      }
    }

    if (m_hasRendered)
    {
      InvalidateCanvas();
    }
  }

  winrt::Windows::Foundation::Size SvgView::MeasureOverride(winrt::Windows::Foundation::Size availableSize)
  {
    for (auto child : Children())
    {
      child.Measure(availableSize);
    }
    return availableSize;
  }

  winrt::Windows::Foundation::Size SvgView::ArrangeOverride(winrt::Windows::Foundation::Size finalSize)
  {
    for (auto child : Children())
    {
      child.Arrange({0, 0, finalSize.Width, finalSize.Height});
    }
    return finalSize;
  }

  void SvgView::Canvas_Draw(
    winrt::Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const & sender,
    winrt::Microsoft::Graphics::Canvas::UI::Xaml::CanvasDrawEventArgs const &args)
  {
    if (!m_hasRendered)
    {
      m_hasRendered = true;
    }

    auto layer{args.DrawingSession().CreateLayer(m_opacity)};

    for (auto child : m_children)
    {
      if (auto group = child.try_as<GroupView>())
      {
        group->DrawChildren(sender, args.DrawingSession());
      }
    }

    layer.Close();
  }

  void SvgView::AddGroup(Windows::UI::Xaml::UIElement const &element)
  {
    if (auto group = element.try_as<GroupView>())
    {
      group->SetParent(get_weak());
      m_children.push_back(element);
    }
  }

  void SvgView::InvalidateCanvas()
  {
    if (m_hasRendered)
    {
      m_canvas.Invalidate();
    }
  }
} // namespace winrt::RNSVG::implementation
