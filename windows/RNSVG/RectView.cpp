#include "pch.h"
#include "RectView.h"
#if __has_include("RectView.g.cpp")
#include "RectView.g.cpp"
#endif

#include <winrt/Microsoft.Graphics.Canvas.Geometry.h>
#include <winrt/Windows.UI.Xaml.Media.h>

#include "JSValueReader.h"
#include "JSValueXaml.h"
#include "Utils.h"

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
          else if (propertyName == "strokeWidth")
          {
            m_strokeWidth = propertyValue.AsSingle();
          }
          else if (propertyName == "stroke")
          {
            if (auto color = Utils::GetColorFromJSValue(propertyValue))
            {
              m_stroke = color.value();
            }
          }
          else if (propertyName == "fill")
          {
            if (auto color = Utils::GetColorFromJSValue(propertyValue))
            {
              m_fill = color.value();
            }
          }
        }

        if (auto parent{m_parent.get()})
        {
          parent.InvalidateCanvas();
        }
        //parent.InvalidateCanvas();
    }

    void RectView::Render(
        Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &canvas,
        Microsoft::Graphics::Canvas::CanvasDrawingSession const &session)
    {
      auto resourceCreator{canvas.try_as<Microsoft::Graphics::Canvas::ICanvasResourceCreator>()};
      auto rect{Microsoft::Graphics::Canvas::Geometry::CanvasGeometry::CreateRoundedRectangle(
          resourceCreator, m_x, m_y, m_width, m_height, m_rx, m_ry)};
      
      session.FillGeometry(rect, m_fill);

      if (m_strokeWidth > 0.0f)
      {
        session.DrawGeometry(rect, m_stroke, m_strokeWidth);
      }

      //session.DrawRoundedRectangle(m_x, m_y, m_width, m_height, m_rx, m_ry, color, m_strokeWidth);
    }
} // namespace winrt::RNSVG::implementation
