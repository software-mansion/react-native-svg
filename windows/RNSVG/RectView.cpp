#include "pch.h"
#include "RectView.h"
#if __has_include("RectView.g.cpp")
#include "RectView.g.cpp"
#endif

#include <winrt/Windows.UI.Xaml.Media.h>

#include "JSValueReader.h"
#include "JSValueXaml.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation
{
    void RectView::UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader)
    {
        const JSValueObject &propertyMap = JSValue::ReadObjectFrom(reader);
        // auto const &propertyMap = Microsoft::ReactNative::JSValueObject::ReadFrom(propertyMapReader);

        for (auto const &pair : propertyMap)
        {
          auto const &propertyName = pair.first;
          auto const &propertyValue = pair.second;

          if (propertyName == "width")
          {
            m_width = propertyValue.AsSingle();
          }
          else if (propertyName == "height")
          {
            m_height = propertyValue.AsSingle();
          }
          else if (propertyName == "x")
          {
            m_x = propertyValue.AsSingle();
          }
          else if (propertyName == "y")
          {
            m_y = propertyValue.AsSingle();
          }
          else if (propertyName == "rx")
          {
            m_rx = propertyValue.AsSingle();
          }
          else if (propertyName == "ry")
          {
            m_ry = propertyValue.AsSingle();
          }
          else if (propertyName == "fill")
          {
            if (auto value = propertyValue.To<Windows::UI::Xaml::Media::Brush>())
            {
              if (auto scb = value.try_as<Windows::UI::Xaml::Media::SolidColorBrush>())
              {
                auto color{scb.Color()};
                m_fill = scb.Color();
              }
            }
          }
        }

        if (auto parent{m_parent.get()})
        {
          parent.InvalidateCanvas();
        }
        //parent.InvalidateCanvas();
    }

    void RectView::Render(Microsoft::Graphics::Canvas::CanvasDrawingSession const &session)
    {
      auto color{Windows::UI::Colors::Red()};
      session.FillRoundedRectangle(m_x, m_y, m_width, m_height, m_rx, m_ry, m_fill);
      session.DrawRoundedRectangle(m_x, m_y, m_width, m_height, m_rx, m_ry, color, 2);
    }
} // namespace winrt::RNSVG::implementation
