#include "pch.h"

#include "JSValueXaml.h"

#include "GroupView.h"
#if __has_include("GroupView.g.cpp")
#include "GroupView.g.cpp"
#endif

#include "SVGLength.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation
{
  void GroupView::AddChild(RNSVG::RenderableView const &child)
  {
    m_children.Append(child);
    if (m_props)
    {
      child.UpdateProperties(m_props, false);
    }
  }

  void GroupView::UpdateProperties(IJSValueReader const &reader, bool invalidate)
  {
    if (!m_props)
    {
      m_props = reader;
    }

    for (auto child : Children())
    {
      child.UpdateProperties(reader, false);
    }

    __super::UpdateProperties(reader, invalidate);
  }

  void GroupView::Render(
    Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const& canvas,
    Microsoft::Graphics::Canvas::CanvasDrawingSession const &session)
  {
    RenderGroup(canvas, session);
  }

  void GroupView::RenderGroup(
    Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &canvas,
    Microsoft::Graphics::Canvas::CanvasDrawingSession const &session)
  {
    for (auto child : Children())
    {
      child.Render(canvas, session);
    }
  }
} // namespace winrt::RNSVG::implementation
