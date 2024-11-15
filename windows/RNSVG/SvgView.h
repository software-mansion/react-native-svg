#pragma once

#include "SvgView.g.h"

#include "SVGLength.h"
#include "Utils.h"

namespace winrt::RNSVG::implementation {

struct SvgView : SvgViewT<SvgView> {
 public:
  SvgView() = default;

  SvgView(winrt::Microsoft::ReactNative::IReactContext const &context);

  xaml::FrameworkElement SvgParent() { return m_parent; }
  void SvgParent(xaml::FrameworkElement const &value);

  Windows::UI::Color CurrentColor() { return m_currentColor; }

  // IRenderablePaper
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate = true, bool invalidate = true);

  // Overrides
  winrt::Windows::Foundation::Size MeasureOverride(winrt::Windows::Foundation::Size const &availableSize);
  winrt::Windows::Foundation::Size ArrangeOverride(winrt::Windows::Foundation::Size const &finalSize);

  void Panel_Loaded(winrt::Windows::Foundation::IInspectable const &sender, xaml::RoutedEventArgs const &args);
  void Panel_Unloaded(winrt::Windows::Foundation::IInspectable const &sender, xaml::RoutedEventArgs const &args);

  winrt::Windows::Foundation::Size CanvasSize() noexcept;

  RNSVG::GroupView Group() { return m_group; }
  void Group(RNSVG::GroupView const &value) { m_group = value; }

  RNSVG::D2DDevice Device() { return m_device; }

  RNSVG::D2DDeviceContext DeviceContext() { return m_deviceContext; }

  RNSVG::D2DGeometry Geometry() { return m_group ? m_group.Geometry() : nullptr; }
  void Geometry(RNSVG::D2DGeometry const & /*value*/) {}

  bool IsResponsible() { return m_isResponsible; }
  void IsResponsible(bool isResponsible) { m_isResponsible = isResponsible; }

  Windows::Foundation::Collections::IMap<hstring, RNSVG::IRenderable> Templates() {
    return m_templates;
  }
  Windows::Foundation::Collections::IMap<hstring, RNSVG::IBrushView> Brushes() {
    return m_brushes;
  }

  // IRenderable
  void MergeProperties(RNSVG::IRenderable const &other);
  void SaveDefinition();
  void Unload();
  void Draw(RNSVG::D2DDeviceContext const &deviceContext, Windows::Foundation::Size const &size);
  void CreateResources();
  void CreateGeometry(RNSVG::D2DDeviceContext const &deviceContext);
  RNSVG::IRenderable HitTest(Windows::Foundation::Point const & /*point*/) { return nullptr; }

  void Invalidate();

 private:
  bool m_loaded{false};
  xaml::FrameworkElement m_parent{nullptr};
  xaml::Controls::Image m_image;
  Windows::UI::Color m_currentColor{Colors::Black()};

  xaml::FrameworkElement::Loaded_revoker m_panelLoadedRevoker{};
  xaml::FrameworkElement::Unloaded_revoker m_panelUnloadedRevoker{};

  // Shared
  Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
  bool m_hasRendered{false};
  bool m_isResponsible{false};
  RNSVG::D2DDevice m_device;
  RNSVG::D2DDeviceContext m_deviceContext;
  RNSVG::GroupView m_group{nullptr};
  hstring m_id{L""};
  float m_minX{0.0f};
  float m_minY{0.0f};
  float m_vbWidth{0.0f};
  float m_vbHeight{0.0f};
  RNSVG::SVGLength m_bbWidth{0, RNSVG::LengthType::Unknown};
  RNSVG::SVGLength m_bbHeight{0, RNSVG::LengthType::Unknown};
  RNSVG::SVGLength m_width{0, RNSVG::LengthType::Unknown};
  RNSVG::SVGLength m_height{0, RNSVG::LengthType::Unknown};
  std::string m_align{""};
  RNSVG::MeetOrSlice m_meetOrSlice{RNSVG::MeetOrSlice::Meet};

  Windows::Foundation::Collections::IMap<hstring, RNSVG::IRenderable> m_templates{
      winrt::single_threaded_map<hstring, RNSVG::IRenderable>()};
  Windows::Foundation::Collections::IMap<hstring, RNSVG::IBrushView> m_brushes{
      winrt::single_threaded_map<hstring, RNSVG::IBrushView>()};
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct SvgView : SvgViewT<SvgView, implementation::SvgView> {};
} // namespace winrt::RNSVG::factory_implementation
