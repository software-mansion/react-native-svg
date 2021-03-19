#include "pch.h"

#include "SvgView.h"
#if __has_include("SvgView.g.cpp")
#include "SvgView.g.cpp"
#endif

#include "GroupView.h"
#include "SVGLength.h"

namespace winrt::RNSVG::implementation
{
  SvgView::SvgView(Microsoft::ReactNative::IReactContext const &context) : m_reactContext(context)
  {
    Background(winrt::Windows::UI::Xaml::Media::SolidColorBrush{winrt::Windows::UI::Colors::LightGray()});
    m_canvasDrawRevoker = m_canvas.Draw(winrt::auto_revoke, {get_weak(), &SvgView::Canvas_Draw});
    m_canvaSizeChangedRevoker = m_canvas.SizeChanged(winrt::auto_revoke, {get_weak(), &SvgView::Canvas_SizeChanged});
    Children().Append(m_canvas);
  }

  void SvgView::UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader)
  {
    auto const &propertyMap = Microsoft::ReactNative::JSValueObject::ReadFrom(reader);

    for (auto const &pair : propertyMap)
    {
      auto const &propertyName = pair.first;
      auto const &propertyValue = pair.second;

      if (propertyName == "width")
      {
        auto svgLength{SVGLength::From(propertyValue)};
        Width(svgLength.Value());
      }
      else if (propertyName == "height")
      {
        auto svgLength{SVGLength::From(propertyValue)};
        Height(svgLength.Value());
      }
      else if (propertyName == "opacity")
      {
        if (propertyValue.IsNull())
        {
          m_opacity = 1.0f;
        } else
        {
          m_opacity = propertyValue.AsSingle();
        }
      }
    }

    InvalidateCanvas();
  }

  winrt::Windows::Foundation::Size SvgView::MeasureOverride(winrt::Windows::Foundation::Size availableSize)
  {
    for (auto child : Children())
    {
      child.Measure(availableSize);
    }
    return availableSize;
  }

  winrt::Windows::Foundation::Size SvgView::ArrangeOverride(winrt::Windows::Foundation::Size finalSize)
  {
    for (auto child : Children())
    {
      child.Arrange({0, 0, finalSize.Width, finalSize.Height});
    }
    return finalSize;
  }

  void SvgView::Canvas_Draw(
    winrt::Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const & sender,
    winrt::Microsoft::Graphics::Canvas::UI::Xaml::CanvasDrawEventArgs const &args)
  {
    if (!m_hasRendered)
    {
      m_hasRendered = true;
    }

    auto layer{args.DrawingSession().CreateLayer(m_opacity)};

    for (auto child : Views())
    {
      if (auto group = child.try_as<IRenderableView>())
      {
        group.Render(sender, args.DrawingSession());
      }
    }

    layer.Close();
  }

  void SvgView::Canvas_SizeChanged(
    Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &/*sender*/,
    Windows::UI::Xaml::SizeChangedEventArgs const &/*args*/)
  {
    //sender.Invalidate();
  }

  void SvgView::InvalidateCanvas()
  {
    if (m_hasRendered)
    {
      m_canvas.Invalidate();
    }
  }
} // namespace winrt::RNSVG::implementation
