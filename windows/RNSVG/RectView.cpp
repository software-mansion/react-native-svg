#include "pch.h"
#include "RectView.h"
#if __has_include("RectView.g.cpp")
#include "RectView.g.cpp"
#endif

#include <winrt/Microsoft.Graphics.Canvas.Geometry.h>

#include "JSValueXaml.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation
{
    void RectView::UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader)
    {
        const JSValueObject &propertyMap = JSValue::ReadObjectFrom(reader);

        for (auto const &pair : propertyMap)
        {
          auto const &propertyName = pair.first;
          auto const &propertyValue = pair.second;

          if (propertyName == "width")
          {
            m_width = SVGLength::From(propertyValue);
          }
          else if (propertyName == "height")
          {
            m_height = SVGLength::From(propertyValue);
          }
          else if (propertyName == "x")
          {
            m_x = SVGLength::From(propertyValue);
          }
          else if (propertyName == "y")
          {
            m_y = SVGLength::From(propertyValue);
          }
          else if (propertyName == "rx")
          {
            m_rx = SVGLength::From(propertyValue);
          }
          else if (propertyName == "ry")
          {
            m_ry = SVGLength::From(propertyValue);
          }
        }

        __super::UpdateProperties(reader);
    }

    void RectView::Render(
        Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const& canvas,
        Microsoft::Graphics::Canvas::CanvasDrawingSession const& session)
    {
      auto resourceCreator{canvas.try_as<Microsoft::Graphics::Canvas::ICanvasResourceCreator>()};
      auto rect{Microsoft::Graphics::Canvas::Geometry::CanvasGeometry::CreateRoundedRectangle(
          resourceCreator, m_x.Value(), m_y.Value(), m_width.Value(), m_height.Value(), m_rx.Value(), m_ry.Value())};
      
      session.FillGeometry(rect, Fill());

      if (StrokeWidth().Value() > 0.0f)
      {
        session.DrawGeometry(rect, Stroke(), StrokeWidth().Value());
      }
    }
} // namespace winrt::RNSVG::implementation
