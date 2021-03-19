#pragma once

#include "RenderableView.h"
#include "RectView.g.h"

namespace winrt::RNSVG::implementation
{
    struct RectView : RectViewT<RectView, RNSVG::implementation::RenderableView>
    {
     public:
        RectView() = default;

        void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader);
        void Render(
            Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const& canvas,
            Microsoft::Graphics::Canvas::CanvasDrawingSession const& session);

     private:
        float m_width{0.0f};
        float m_height{0.0f};
        float m_x{0.0f};
        float m_y{0.0f};
        float m_rx{0.0f};
        float m_ry{0.0f};
    };
}

namespace winrt::RNSVG::factory_implementation
{
  struct RectView : RectViewT<RectView, implementation::RectView>
  {
  };
} // namespace winrt::RNSVG::factory_implementation
