#pragma once

#include "SvgView.g.h"

namespace winrt::RNSVG::implementation
{
  struct SvgView : SvgViewT<SvgView>
  {
    SvgView() = default;

    SvgView(Microsoft::ReactNative::IReactContext const &context);
    Windows::Foundation::Collections::IVector<Windows::UI::Xaml::UIElement> Views() { return m_views; }
    void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader);

    // Overrides
    winrt::Windows::Foundation::Size MeasureOverride(winrt::Windows::Foundation::Size availableSize);
    winrt::Windows::Foundation::Size ArrangeOverride(winrt::Windows::Foundation::Size finalSize);

    // CanvasControl
    void Canvas_Draw(
        Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &sender,
        Microsoft::Graphics::Canvas::UI::Xaml::CanvasDrawEventArgs const &args);

    void Canvas_SizeChanged(
        winrt::Windows::Foundation::IInspectable const sender,
        Windows::UI::Xaml::SizeChangedEventArgs const &args);

    void InvalidateCanvas();

   private:
    bool m_hasRendered{false};
    Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
    Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl m_canvas{};
    float m_opacity{1.0f};
    Windows::Foundation::Collections::IVector<Windows::UI::Xaml::UIElement> m_views{
        winrt::single_threaded_vector<Windows::UI::Xaml::UIElement>()};

    Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl::Draw_revoker m_canvasDrawRevoker{};
    Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl::SizeChanged_revoker m_canvaSizeChangedRevoker{};
  };
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation
{
  struct SvgView : SvgViewT<SvgView, implementation::SvgView>
  {
  };
} // namespace winrt::RNSVG::factory_implementation
