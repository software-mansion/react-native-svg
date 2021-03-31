#pragma once

#include "SvgView.g.h"

namespace winrt::RNSVG::implementation {
struct SvgView : SvgViewT<SvgView> {
 public:
  SvgView() = default;

  SvgView(Microsoft::ReactNative::IReactContext const &context);
  Windows::Foundation::Collections::IVector<Windows::UI::Xaml::UIElement> Views() {
    return m_views;
  }
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader);

  // Overrides
  Windows::Foundation::Size MeasureOverride(Windows::Foundation::Size availableSize);
  Windows::Foundation::Size ArrangeOverride(Windows::Foundation::Size finalSize);

  // CanvasControl
  void Canvas_Draw(
      Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &sender,
      Microsoft::Graphics::Canvas::UI::Xaml::CanvasDrawEventArgs const &args);

  void Canvas_SizeChanged(
      Windows::Foundation::IInspectable const &sender,
      Windows::UI::Xaml::SizeChangedEventArgs const &args);

  void InvalidateCanvas();

 private:
  bool m_hasRendered{false};
  Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
  Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl m_canvas{};
  float m_opacity{1.0f};
  float m_scale{0.0f};
  float m_minX{0.0f};
  float m_minY{0.0f};
  float m_vbWidth{0.0f};
  float m_vbHeight{0.0f};
  RNSVG::SVGLength m_bbWidth{};
  RNSVG::SVGLength m_bbHeight{};
  std::string m_align{""};
  RNSVG::MeetOrSlice m_meetOrSlice{RNSVG::MeetOrSlice::Meet};

  Windows::Foundation::Collections::IVector<Windows::UI::Xaml::UIElement> m_views{
      winrt::single_threaded_vector<Windows::UI::Xaml::UIElement>()};

  Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl::Draw_revoker m_canvasDrawRevoker{};
  Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl::SizeChanged_revoker m_canvaSizeChangedRevoker{};
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct SvgView : SvgViewT<SvgView, implementation::SvgView> {};
} // namespace winrt::RNSVG::factory_implementation
