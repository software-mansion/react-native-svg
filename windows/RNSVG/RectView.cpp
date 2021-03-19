#include "pch.h"
#include "RectView.h"
#if __has_include("RectView.g.cpp")
#include "RectView.g.cpp"
#endif

#include <winrt/Microsoft.Graphics.Canvas.Geometry.h>

#include "JSValueXaml.h"
#include "SVGLength.h"
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
            auto svgLength{SVGLength::From(propertyValue)};
            m_width = static_cast<float>(svgLength.Value());
          }
          else if (propertyName == "height")
          {
            auto svgLength{SVGLength::From(propertyValue)};
            m_height = static_cast<float>(svgLength.Value());
          }
          else if (propertyName == "x")
          {
            auto svgLength{SVGLength::From(propertyValue)};
            m_x = static_cast<float>(svgLength.Value());
          }
          else if (propertyName == "y")
          {
            auto svgLength{SVGLength::From(propertyValue)};
            m_y = static_cast<float>(svgLength.Value());
          }
          else if (propertyName == "rx")
          {
            auto svgLength{SVGLength::From(propertyValue)};
            m_rx = static_cast<float>(svgLength.Value());
          }
          else if (propertyName == "ry")
          {
            auto svgLength{SVGLength::From(propertyValue)};
            m_ry = static_cast<float>(svgLength.Value());
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
          resourceCreator, m_x, m_y, m_width, m_height, m_rx, m_ry)};
      
      session.FillGeometry(rect, Fill());

      if (StrokeWidth() > 0.0f)
      {
        session.DrawGeometry(rect, Stroke(), StrokeWidth());
      }
    }
} // namespace winrt::RNSVG::implementation
