#pragma once

#include "SvgView.g.h"

namespace winrt::RNSVG::implementation
{
  struct SvgView : SvgViewT<SvgView>
  {
    SvgView() = default;

    SvgView(Microsoft::ReactNative::IReactContext const &context);
    void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader);

    // Overrides
    winrt::Windows::Foundation::Size MeasureOverride(winrt::Windows::Foundation::Size availableSize);
    winrt::Windows::Foundation::Size ArrangeOverride(winrt::Windows::Foundation::Size finalSize);

    // CanvasControl
    void Canvas_Draw(
        Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &sender,
        Microsoft::Graphics::Canvas::UI::Xaml::CanvasDrawEventArgs const &args);

    void AddGroup(Windows::UI::Xaml::UIElement const &element);
    void InvalidateCanvas();

   private:
    bool m_hasRendered{false};
    Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
    Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl m_canvas{};
    float m_opacity{1.0f};

    std::vector<Windows::UI::Xaml::UIElement> m_children{};
  };
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation
{
  struct SvgView : SvgViewT<SvgView, implementation::SvgView>
  {
  };
} // namespace winrt::RNSVG::factory_implementation
