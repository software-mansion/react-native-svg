#pragma once

#include "RenderableView.g.h"
#include "SVGLength.h"

namespace winrt::RNSVG::implementation
{
    struct RenderableView : RenderableViewT<RenderableView>
    {
     public:
        RenderableView() = default;

        Windows::UI::Xaml::FrameworkElement SvgParent() { return m_parent; }
        void SvgParent(Windows::UI::Xaml::FrameworkElement const &value) { m_parent = value; }

        Windows::UI::Color Fill() { return m_fill; }
        void Fill(Windows::UI::Color const &value) { m_fill = value; }

        float FillOpacity() { return m_fillOpacity; }
        void FillOpacity(float value) { m_fillOpacity = value; }

        Windows::UI::Color Stroke() { return m_stroke; }
        void Stroke(Windows::UI::Color const &value) { m_stroke = value; }

        float StrokeOpacity() { return m_strokeOpacity; }
        void StrokeOpacity(float value) { m_strokeOpacity = value; }

        RNSVG::SVGLength StrokeWidth() { return m_strokeWidth; }
        void StrokeWidth(RNSVG::SVGLength value) { m_strokeWidth = value; }

        void InvalidateCanvas();
        virtual void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader);

        virtual void Render(
            Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const& canvas,
            Microsoft::Graphics::Canvas::CanvasDrawingSession const& session) = 0;

     private:
        Microsoft::ReactNative::IReactContext m_reactContext{nullptr};

        Windows::UI::Xaml::FrameworkElement m_parent{nullptr};
        Windows::UI::Color m_fill{Windows::UI::Colors::Transparent()};
        Windows::UI::Color m_stroke{Windows::UI::Colors::Transparent()};
        float m_fillOpacity{1.0f};
        float m_strokeOpacity{1.0f};
        RNSVG::SVGLength m_strokeWidth{};
    };
}
