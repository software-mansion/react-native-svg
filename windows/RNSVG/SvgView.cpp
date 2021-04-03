#include "pch.h"

#include "SvgView.h"
#if __has_include("SvgView.g.cpp")
#include "SvgView.g.cpp"
#endif

#include <winrt/Windows.Graphics.Display.h>

#include "GroupView.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;
using namespace Windows::Graphics::Display;

namespace winrt::RNSVG::implementation {
SvgView::SvgView(IReactContext const &context) : m_reactContext(context) {
  m_scale = static_cast<float>(DisplayInformation::GetForCurrentView().ResolutionScale()) / 100;

  m_canvasDrawRevoker = m_canvas.Draw(winrt::auto_revoke, {get_weak(), &SvgView::Canvas_Draw});
  m_canvaSizeChangedRevoker = m_canvas.SizeChanged(winrt::auto_revoke, {get_weak(), &SvgView::Canvas_SizeChanged});
  m_panelUnloadedRevoker = Unloaded(winrt::auto_revoke, {get_weak(), &SvgView::Panel_Unloaded});

  Children().Append(m_canvas);
}

void SvgView::UpdateProperties(IJSValueReader const &reader) {
  auto const &propertyMap{JSValueObject::ReadFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "bbWidth") {
      m_bbWidth = SVGLength::From(propertyValue);
      Width(m_bbWidth.Value());
    } else if (propertyName == "bbHeight") {
      m_bbHeight = SVGLength::From(propertyValue);
      Height(m_bbHeight.Value());
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
    } else if (propertyName == "opacity") {
      m_opacity = Utils::JSValueAsFloat(propertyValue, 1.0f);
    }
  }

  InvalidateCanvas();
}

Size SvgView::MeasureOverride(Size availableSize) {
  for (auto const &child : Children()) {
    child.Measure(availableSize);
  }
  return availableSize;
}

Size SvgView::ArrangeOverride(Size finalSize) {
  for (auto const &child : Children()) {
    child.Arrange({0, 0, finalSize.Width, finalSize.Height});
  }
  return finalSize;
}

void SvgView::Canvas_Draw(UI::Xaml::CanvasControl const &sender, UI::Xaml::CanvasDrawEventArgs const &args) {
  if (!m_hasRendered) {
    m_hasRendered = true;
  }

  auto layer{args.DrawingSession().CreateLayer(m_opacity)};

  if (m_align != "") {
    Rect vbRect{m_minX * m_scale, m_minY * m_scale, m_vbWidth * m_scale, m_vbHeight * m_scale};
    Rect elRect{0, 0, static_cast<float>(sender.ActualWidth()), static_cast<float>(sender.ActualHeight())};

    args.DrawingSession().Transform(Utils::GetViewBoxTransform(vbRect, elRect, m_align, m_meetOrSlice));
  }

  for (auto const &child : Views()) {
    if (auto const &group{child.try_as<IRenderableView>()}) {
      group.SaveDefinition();
    }
  }

  for (auto const &child : Views()) {
    if (auto const &group{child.try_as<IRenderableView>()}) {
      group.Render(sender, args.DrawingSession());
    }
  }

  layer.Close();
}

void SvgView::Canvas_SizeChanged(
    IInspectable const & /*sender*/,
    Windows::UI::Xaml::SizeChangedEventArgs const & /*args*/) {
  // sender.Invalidate();
}

void SvgView::InvalidateCanvas() {
  if (m_hasRendered) {
    m_canvas.Invalidate();
  }
}

void SvgView::Panel_Unloaded(IInspectable const &sender, Windows::UI::Xaml::RoutedEventArgs const & /*args*/) {
  if (auto const &svgView{sender.try_as<RNSVG::SvgView>()}) {
    m_reactContext = nullptr;
    m_templates.Clear();
    m_brushes.Clear();
    m_canvas.RemoveFromVisualTree();
    m_canvas = nullptr;

    for (auto const &child : m_views) {
      if (auto const &renderable{child.try_as<RNSVG::RenderableView>()}) {
        renderable.Unload();
      }
    }

    m_views.Clear();
  }
}
} // namespace winrt::RNSVG::implementation
