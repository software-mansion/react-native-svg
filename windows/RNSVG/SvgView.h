#pragma once

#include "SvgView.g.h"

namespace winrt::RNSVG::implementation {
struct SvgView : SvgViewT<SvgView> {
 public:
  SvgView() = default;

  SvgView(Microsoft::ReactNative::IReactContext const &context);

  Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl Canvas() { return m_canvas; }

  Windows::UI::Xaml::FrameworkElement SvgParent() { return m_parent; }
  void SvgParent(Windows::UI::Xaml::FrameworkElement const &value);

  RNSVG::GroupView Group() { return m_group; }
  void Group(RNSVG::GroupView const &value) { m_group = value; }

  Microsoft::Graphics::Canvas::Geometry::CanvasGeometry Geometry() { return m_group ? m_group.Geometry() : nullptr; }
  void Geometry(Microsoft::Graphics::Canvas::Geometry::CanvasGeometry /*value*/) { }

  float SvgScale() { return m_scale; }

  Windows::Foundation::Collections::IMap<hstring, RNSVG::IRenderable> Templates() {
    return m_templates;
  }
  Windows::Foundation::Collections::IMap<hstring, RNSVG::BrushView> Brushes() {
    return m_brushes;
  }

  // IRenderable
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate = true, bool invalidate = true);
  void MergeProperties(RNSVG::RenderableView const &other);
  void SaveDefinition();
  void Unload();
  void Render(
      Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &canvas,
      Microsoft::Graphics::Canvas::CanvasDrawingSession const &session);
  void CreateResources(
      Microsoft::Graphics::Canvas::ICanvasResourceCreator const &resourceCreator,
      Microsoft::Graphics::Canvas::UI::CanvasCreateResourcesEventArgs const &args);

  // Overrides
  Windows::Foundation::Size MeasureOverride(Windows::Foundation::Size availableSize);
  Windows::Foundation::Size ArrangeOverride(Windows::Foundation::Size finalSize);

  // CanvasControl
  void Canvas_Draw(
      Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &sender,
      Microsoft::Graphics::Canvas::UI::Xaml::CanvasDrawEventArgs const &args);
  void Canvas_CreateResources(
      Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &sender,
      Microsoft::Graphics::Canvas::UI::CanvasCreateResourcesEventArgs const &args);
  void Canvas_SizeChanged(
      Windows::Foundation::IInspectable const &sender,
      Windows::UI::Xaml::SizeChangedEventArgs const &args);

  void Panel_Unloaded(Windows::Foundation::IInspectable const &sender, Windows::UI::Xaml::RoutedEventArgs const &args);

  void InvalidateCanvas();

 private:
  bool m_hasRendered{false};
  Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
  Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl m_canvas{};
  Windows::UI::Xaml::FrameworkElement m_parent{nullptr};
  RNSVG::GroupView m_group{nullptr};
  hstring m_id{L""};
  float m_scale{0.0f};
  float m_minX{0.0f};
  float m_minY{0.0f};
  float m_vbWidth{0.0f};
  float m_vbHeight{0.0f};
  RNSVG::SVGLength m_bbWidth{};
  RNSVG::SVGLength m_bbHeight{};
  RNSVG::SVGLength m_width{};
  RNSVG::SVGLength m_height{};
  std::string m_align{""};
  RNSVG::MeetOrSlice m_meetOrSlice{RNSVG::MeetOrSlice::Meet};

  Windows::Foundation::Collections::IMap<hstring, RNSVG::IRenderable> m_templates{
      winrt::single_threaded_map<hstring, RNSVG::IRenderable>()};
  Windows::Foundation::Collections::IMap<hstring, RNSVG::BrushView> m_brushes{
      winrt::single_threaded_map<hstring, RNSVG::BrushView>()};
  Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl::Draw_revoker m_canvasDrawRevoker{};
  Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl::CreateResources_revoker m_canvasCreateResourcesRevoker{};
  Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl::SizeChanged_revoker m_canvasSizeChangedRevoker{};
  Windows::UI::Xaml::FrameworkElement::Unloaded_revoker m_panelUnloadedRevoker{};
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct SvgView : SvgViewT<SvgView, implementation::SvgView> {};
} // namespace winrt::RNSVG::factory_implementation
