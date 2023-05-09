#pragma once

#include "SvgView.g.h"

namespace winrt::RNSVG::implementation {
struct SvgView : SvgViewT<SvgView> {
 public:
  SvgView() = default;

  SvgView(Microsoft::ReactNative::IReactContext const &context);

  Windows::UI::Xaml::FrameworkElement SvgParent() { return m_parent; }
  void SvgParent(Windows::UI::Xaml::FrameworkElement const &value);

  RNSVG::GroupView Group() { return m_group; }
  void Group(RNSVG::GroupView const &value) { m_group = value; }

  Windows::Foundation::IInspectable Device() {
    Windows::Foundation::IInspectable asInspectable;
    copy_from_abi(asInspectable, m_device.get());

    return asInspectable;
  }

  Windows::Foundation::IInspectable DeviceContext() {
    Windows::Foundation::IInspectable asInspectable;
    copy_from_abi(asInspectable, m_deviceContext.get());

    return asInspectable;
  }

  Windows::Foundation::IInspectable Geometry() { return m_group ? m_group.Geometry() : nullptr; }
  void Geometry(Windows::Foundation::IInspectable /*value*/) {}

  Windows::UI::Color CurrentColor() { return m_currentColor; }

  bool IsResponsible() { return m_isResponsible; }
  void IsResponsible(bool isResponsible) { m_isResponsible = isResponsible; }

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
  void Draw(Windows::Foundation::IInspectable const& deviceContext, Windows::Foundation::Size size);
  void CreateResources();
  void CreateGeometry();
  RNSVG::IRenderable HitTest(Windows::Foundation::Point const & /*point*/) { return nullptr; }

  // Overrides
  Windows::Foundation::Size MeasureOverride(Windows::Foundation::Size availableSize);
  Windows::Foundation::Size ArrangeOverride(Windows::Foundation::Size finalSize);

  void Panel_Loaded(Windows::Foundation::IInspectable const &sender, Windows::UI::Xaml::RoutedEventArgs const &args);
  void Panel_Unloaded(Windows::Foundation::IInspectable const &sender, Windows::UI::Xaml::RoutedEventArgs const &args);

  void Invalidate();

 private:
  bool m_hasRendered{false};
  bool m_isResponsible{false};
  Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
  Windows::UI::Xaml::FrameworkElement m_parent{nullptr};
  com_ptr<ID2D1Device> m_device{nullptr};
  com_ptr<ID2D1DeviceContext> m_deviceContext{nullptr};
  Windows::UI::Xaml::Controls::Image m_image;
  RNSVG::GroupView m_group{nullptr};
  hstring m_id{L""};
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
  Windows::UI::Color m_currentColor{Windows::UI::Colors::Black()};

  Windows::Foundation::Collections::IMap<hstring, RNSVG::IRenderable> m_templates{
      winrt::single_threaded_map<hstring, RNSVG::IRenderable>()};
  Windows::Foundation::Collections::IMap<hstring, RNSVG::BrushView> m_brushes{
      winrt::single_threaded_map<hstring, RNSVG::BrushView>()};
  Windows::UI::Xaml::FrameworkElement::Loaded_revoker m_panelLoadedRevoker{};
  Windows::UI::Xaml::FrameworkElement::Unloaded_revoker m_panelUnloadedRevoker{};

  void Draw2(Windows::Foundation::IInspectable const &deviceContext, Windows::Foundation::Size size);
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct SvgView : SvgViewT<SvgView, implementation::SvgView> {};
} // namespace winrt::RNSVG::factory_implementation
