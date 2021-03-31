#include "pch.h"

#include "SvgView.h"
#if __has_include("SvgView.g.cpp")
#include "SvgView.g.cpp"
#endif

#include <winrt/Windows.Graphics.Display.h>

#include "GroupView.h"
#include "SVGLength.h"
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
  Children().Append(m_canvas);
}

void SvgView::UpdateProperties(IJSValueReader const &reader) {
  auto const &propertyMap = JSValueObject::ReadFrom(reader);

  for (auto const &pair : propertyMap) {
    auto const &propertyName = pair.first;
    auto const &propertyValue = pair.second;

    if (propertyName == "bbWidth") {
      m_bbWidth = SVGLength::From(propertyValue);
      Width(m_bbWidth.Value());
    } else if (propertyName == "bbHeight") {
      m_bbHeight = SVGLength::From(propertyValue);
      Height(m_bbHeight.Value());
    } else if (propertyName == "vbWidth") {
      if (propertyValue.IsNull()) {
        m_vbWidth = 0.0f;
      } else {
        m_vbWidth = propertyValue.AsSingle();
      }
    } else if (propertyName == "vbHeight") {
      if (propertyValue.IsNull()) {
        m_vbHeight = 0.0f;
      } else {
        m_vbHeight = propertyValue.AsSingle();
      }
    } else if (propertyName == "minX") {
      if (propertyValue.IsNull()) {
        m_minX = 0.0f;
      } else {
        m_minX = propertyValue.AsSingle();
      }
    } else if (propertyName == "minY") {
      if (propertyValue.IsNull()) {
        m_minY = 0.0f;
      } else {
        m_minY = propertyValue.AsSingle();
      }
    } else if (propertyName == "align") {
      if (propertyValue.IsNull()) {
        m_align = "";
      } else {
        m_align = propertyValue.AsString();
      }
    } else if (propertyName == "meetOrSlice") {
      if (propertyValue.IsNull()) {
        m_meetOrSlice = RNSVG::MeetOrSlice::Meet;
      } else {
        switch (propertyValue.AsInt8()) {
          case 2:
            m_meetOrSlice = RNSVG::MeetOrSlice::None;
            break;
          case 1:
            m_meetOrSlice = RNSVG::MeetOrSlice::Slice;
            break;
          case 0:
          default:
            m_meetOrSlice = RNSVG::MeetOrSlice::Meet;
        }
      }
    } else if (propertyName == "opacity") {
      if (propertyValue.IsNull()) {
        m_opacity = 1.0f;
      } else {
        m_opacity = propertyValue.AsSingle();
      }
    }
  }

  InvalidateCanvas();
}

Size SvgView::MeasureOverride(Size availableSize) {
  for (auto child : Children()) {
    child.Measure(availableSize);
  }
  return availableSize;
}

Size SvgView::ArrangeOverride(Size finalSize) {
  for (auto child : Children()) {
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

  for (auto child : Views()) {
    if (auto group = child.try_as<IRenderableView>()) {
      group.Render(sender, args.DrawingSession());
    }
  }

  layer.Close();
}

void SvgView::Canvas_SizeChanged(
    IInspectable const &/*sender*/,
    Windows::UI::Xaml::SizeChangedEventArgs const & /*args*/) {
  // sender.Invalidate();
}

void SvgView::InvalidateCanvas() {
  if (m_hasRendered) {
    m_canvas.Invalidate();
  }
}
} // namespace winrt::RNSVG::implementation
