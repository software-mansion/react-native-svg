#include "pch.h"

#include "JSValueXaml.h"

#include "GroupView.h"
#if __has_include("GroupView.g.cpp")
#include "GroupView.g.cpp"
#endif

#include "SVGLength.h"

namespace winrt::RNSVG::implementation
{
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
