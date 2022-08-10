#include "pch.h"
#include "PatternView.h"
#include "PatternView.g.cpp"

#include "Utils.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void PatternView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "x") {
      m_x = SVGLength::From(propertyValue);
    } else if (propertyName == "y") {
      m_y = SVGLength::From(propertyValue);
    } else if (propertyName == "width") {
      m_width = SVGLength::From(propertyValue);
    } else if (propertyName == "height") {
      m_height = SVGLength::From(propertyValue);
    } else if (propertyName == "patternUnits") {
      m_patternUnits = Utils::JSValueAsBrushUnits(propertyValue);
    } else if (propertyName == "patternContentUnits") {
      m_patternContentUnits = Utils::JSValueAsBrushUnits(propertyValue, "userSpaceOnUse");
    } else if (propertyName == "patternTransform") {
      m_transformSet = true;
      m_transform = Utils::JSValueAsTransform(propertyValue);

      if (propertyValue.IsNull()) {
        m_transformSet = false;
      }
    } else if (propertyName == "vbWidth") {
      m_vbWidth = Utils::JSValueAsFloat(propertyValue);
    } else if (propertyName == "vbHeight") {
      m_vbHeight = Utils::JSValueAsFloat(propertyValue);
    } else if (propertyName == "minX") {
      m_minX = Utils::JSValueAsFloat(propertyValue);
    } else if (propertyName == "minY") {
      m_minY = Utils::JSValueAsFloat(propertyValue);
    } else if (propertyName == "align") {
      m_align = Utils::JSValueAsString(propertyValue);
    } else if (propertyName == "meetOrSlice") {
      m_meetOrSlice = Utils::GetMeetOrSlice(propertyValue);
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);

  SaveDefinition();

  if (auto const &root{SvgRoot()}) {
    root.InvalidateCanvas();
  }
}

void PatternView::UpdateBounds() {
  if (m_patternUnits == "objectBoundingBox") {
    Rect rect{GetAdjustedRect(m_bounds)};
    CreateBrush(rect);
  }
}

void PatternView::CreateBrush() {
  auto const &canvas{SvgRoot().Canvas()};

  Rect elRect{GetAdjustedRect({0, 0, canvas.Size().Width, canvas.Size().Height})};
  CreateBrush(elRect);
}

void PatternView::CreateBrush(Windows::Foundation::Rect const &rect) {
  auto const &canvas{SvgRoot().Canvas()};
  auto const &resourceCreator{canvas.try_as<ICanvasResourceCreator>()};

  if (auto const &cmdList{GetCommandList(rect)}) {
    Brushes::CanvasImageBrush brush{resourceCreator, cmdList};

    brush.SourceRectangle(rect);
    brush.ExtendX(Microsoft::Graphics::Canvas::CanvasEdgeBehavior::Wrap);
    brush.ExtendY(Microsoft::Graphics::Canvas::CanvasEdgeBehavior::Wrap);

    cmdList.Close();

    m_brush = brush;
  }
}

Windows::Foundation::Rect PatternView::GetAdjustedRect(Windows::Foundation::Rect const &bounds) {
  float x{Utils::GetAbsoluteLength(m_x, bounds.Width) + bounds.X};
  float y{Utils::GetAbsoluteLength(m_y, bounds.Height) + bounds.Y};
  float width{Utils::GetAbsoluteLength(m_width, bounds.Width)};
  float height{Utils::GetAbsoluteLength(m_height, bounds.Height)};

  return {x, y, width, height};
}

Microsoft::Graphics::Canvas::CanvasCommandList PatternView::GetCommandList(Windows::Foundation::Rect const &rect) {
  auto const &root{SvgRoot()};
  auto const &canvas{root.Canvas()};
  auto const &cmdList{CanvasCommandList(canvas)};
  auto const &session{cmdList.CreateDrawingSession()};
  
  if (m_align != "") {
    Rect vbRect{
        m_minX * root.SvgScale(),
        m_minY * root.SvgScale(),
        (m_vbWidth + m_minX) * root.SvgScale(),
        (m_vbHeight + m_minY) * root.SvgScale()};

    auto transform{Utils::GetViewBoxTransform(vbRect, rect, m_align, m_meetOrSlice)};

    if (m_transformSet) {
      transform = transform * m_transform;
    }

    session.Transform(transform);
  }

  for (auto const &child : Children()) {
    child.Render(canvas, session);
  }

  session.Close();
  return cmdList;
}



} // namespace winrt::RNSVG::implementation
