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
  m_canvasCreateResourcesRevoker = m_canvas.CreateResources(winrt::auto_revoke, {get_weak(), &SvgView::Canvas_CreateResources});
  m_canvasSizeChangedRevoker = m_canvas.SizeChanged(winrt::auto_revoke, {get_weak(), &SvgView::Canvas_SizeChanged});
  m_panelUnloadedRevoker = Unloaded(winrt::auto_revoke, {get_weak(), &SvgView::Panel_Unloaded});

  Children().Append(m_canvas);
}

void SvgView::SvgParent(Windows::UI::Xaml::FrameworkElement const &value) {
  if (value) {
    m_canvasDrawRevoker.revoke();
    m_canvasCreateResourcesRevoker.revoke();
    m_canvasSizeChangedRevoker.revoke();
    m_panelUnloadedRevoker.revoke();
    m_canvas.RemoveFromVisualTree();
    m_canvas = nullptr;
    m_parent = value;
  }
}

void SvgView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  // If forceUpdate is false, that means this is a nested Svg
  // and we're inheriting props. Pass those along to the group.
  if (!forceUpdate && m_group) {
    m_group.UpdateProperties(reader, forceUpdate, invalidate);
  } else {
    auto const &propertyMap{JSValueObject::ReadFrom(reader)};

    for (auto const &pair : propertyMap) {
      auto const &propertyName{pair.first};
      auto const &propertyValue{pair.second};

      if (propertyName == "name") {
        if (m_parent && m_group) {
          m_group.SvgRoot().Templates().Remove(m_id);
        }
        m_id = to_hstring(Utils::JSValueAsString(propertyValue));
        if (m_parent) {
          SaveDefinition();
        }
      } else if (propertyName == "width") {
        m_width = SVGLength::From(propertyValue);
      } else if (propertyName == "height") {
        m_height = SVGLength::From(propertyValue);
      } else if (propertyName == "bbWidth") {
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
      } else if (propertyName == "color") {
        m_currentColor = Utils::JSValueAsColor(propertyValue);
      } else if (propertyName == "responsible") {
        m_isResponsible = propertyValue.AsBoolean();
      }
    }

    InvalidateCanvas();
  }
}

void SvgView::SaveDefinition() {
  if (m_id != L"" && m_group) {
    m_group.SvgRoot().Templates().Insert(m_id, *this);
    m_group.SaveDefinition();
  }
}

void SvgView::MergeProperties(RNSVG::RenderableView const &other) {
  if (m_group) {
    m_group.MergeProperties(other);
  }
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

void SvgView::Render(UI::Xaml::CanvasControl const & canvas, CanvasDrawingSession const & session) {
  if (m_align != "") {
    Rect vbRect{m_minX * m_scale, m_minY * m_scale, m_vbWidth * m_scale, m_vbHeight * m_scale};
    float width{static_cast<float>(canvas.ActualWidth())};
    float height{static_cast<float>(canvas.ActualHeight())};
    bool nested{m_parent};

    if (nested) {
      width = Utils::GetAbsoluteLength(m_bbWidth, width);
      height = Utils::GetAbsoluteLength(m_bbHeight, height);
    }

    Rect elRect{0, 0, width, height};

    session.Transform(Utils::GetViewBoxTransform(vbRect, elRect, m_align, m_meetOrSlice));
  }

  if (m_group) {
    m_group.SaveDefinition();
    m_group.Render(canvas, session);
  }
}

void SvgView::Canvas_Draw(UI::Xaml::CanvasControl const &sender, UI::Xaml::CanvasDrawEventArgs const &args) {
  if (!m_hasRendered) {
    m_hasRendered = true;
  }

  m_brushes.Clear();
  m_templates.Clear();

  Render(sender, args.DrawingSession());
}

void SvgView::CreateResources(ICanvasResourceCreator const &resourceCreator, UI::CanvasCreateResourcesEventArgs const &args) {
  if (m_group) {
    m_group.CreateResources(resourceCreator, args);
  }
}

void SvgView::CreateGeometry(UI::Xaml::CanvasControl const& canvas) {
  if (m_group) {
    m_group.CreateGeometry(canvas);
  }
}

void SvgView::Canvas_CreateResources(UI::Xaml::CanvasControl const &sender, UI::CanvasCreateResourcesEventArgs const &args) {
  CreateResources(sender, args);
}

void SvgView::Canvas_SizeChanged(
    IInspectable const & /*sender*/,
    Windows::UI::Xaml::SizeChangedEventArgs const & /*args*/) {
  // sender.Invalidate();
}

void SvgView::Panel_Unloaded(IInspectable const &sender, Windows::UI::Xaml::RoutedEventArgs const & /*args*/) {
  if (auto const &svgView{sender.try_as<RNSVG::SvgView>()}) {
    svgView.Unload();
  }
}

void SvgView::Unload() {
  m_reactContext = nullptr;
  m_templates.Clear();
  m_brushes.Clear();

  if (m_group) {
    m_group.Unload();
  }

  if (m_canvas) {
    m_canvas.RemoveFromVisualTree();
    m_canvas = nullptr;
  }
}

void SvgView::InvalidateCanvas() {
  if (m_hasRendered) {
    m_canvas.Invalidate();
  }
}
} // namespace winrt::RNSVG::implementation
