#include "pch.h"
#include "RectView.h"
#if __has_include("RectView.g.cpp")
#include "RectView.g.cpp"
#endif

#include "JSValueXaml.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void RectView::UpdateProperties(IJSValueReader const &reader, bool invalidate) {
  const JSValueObject &propertyMap = JSValue::ReadObjectFrom(reader);

  for (auto const &pair : propertyMap) {
    auto const &propertyName = pair.first;
    auto const &propertyValue = pair.second;

    if (propertyName == "width") {
      m_width = SVGLength::From(propertyValue);
    } else if (propertyName == "height") {
      m_height = SVGLength::From(propertyValue);
    } else if (propertyName == "x") {
      m_x = SVGLength::From(propertyValue);
    } else if (propertyName == "y") {
      m_y = SVGLength::From(propertyValue);
    } else if (propertyName == "rx") {
      m_rx = SVGLength::From(propertyValue);
    } else if (propertyName == "ry") {
      m_ry = SVGLength::From(propertyValue);
    }
  }

  __super::UpdateProperties(reader, invalidate);
}

void RectView::Render(UI::Xaml::CanvasControl const &canvas, CanvasDrawingSession const &session) {
  auto resourceCreator{canvas.try_as<ICanvasResourceCreator>()};
  auto rect{Geometry::CanvasGeometry::CreateRoundedRectangle(
      resourceCreator, m_x.Value(), m_y.Value(), m_width.Value(), m_height.Value(), m_rx.Value(), m_ry.Value())};

  rect = rect.Transform(SvgScale() * SvgRotation());

  auto fillLayer{session.CreateLayer(FillOpacity())};
  session.FillGeometry(rect, Fill());
  fillLayer.Close();

  if (StrokeWidth().Value() > 0.0f) {
    auto strokeLayer{session.CreateLayer(StrokeOpacity())};
    Geometry::CanvasStrokeStyle strokeStyle{};
    strokeStyle.EndCap(StrokeLineCap());
    strokeStyle.LineJoin(StrokeLineJoin());
    strokeStyle.DashOffset(StrokeDashOffset());
    strokeStyle.MiterLimit(StrokeMiterLimit());
    strokeStyle.CustomDashStyle(Utils::GetValueArray(StrokeDashArray()));
    session.DrawGeometry(rect, Stroke(), StrokeWidth().Value(), strokeStyle);
    strokeLayer.Close();
  }
}
} // namespace winrt::RNSVG::implementation
