#include "pch.h"

#include "JSValueXaml.h"

#include "GroupView.h"
#if __has_include("GroupView.g.cpp")
#include "GroupView.g.cpp"
#endif

#include "SVGLength.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void GroupView::AddChild(RNSVG::RenderableView const &child) {
  m_children.Append(child);
  if (m_props) {
    child.UpdateProperties(m_props, false, false);
  }
}

void GroupView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  if (!m_props) {
    m_props = reader;
  }

  __super::UpdateProperties(reader, forceUpdate, false);

  for (auto child : Children()) {
    child.UpdateProperties(reader, false, false);
  }

  if (invalidate) {
    InvalidateCanvas();
  }
}

void GroupView::CreateGeometry(ICanvasResourceCreator const &resourceCreator)
{
  std::vector<Geometry::CanvasGeometry> geometries;
  for (auto child : Children()) {
    geometries.push_back(child.Geometry());
  }

  Geometry(Geometry::CanvasGeometry::CreateGroup(resourceCreator, geometries, FillRule()));
}

void GroupView::Render(
    UI::Xaml::CanvasControl const &canvas,
    CanvasDrawingSession const &session) {
  RenderGroup(canvas, session);
}

void GroupView::RenderGroup(
    UI::Xaml::CanvasControl const &canvas,
    CanvasDrawingSession const &session) {

  for (auto child : Children()) {
    child.Render(canvas, session);
  }
}
} // namespace winrt::RNSVG::implementation
