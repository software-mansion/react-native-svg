#pragma once

#include "SvgView.g.h"

#ifdef USE_FABRIC
#include "SvgViewProps.g.h"

#include <JSValueComposition.h>
#include "NativeModules.h"
#endif

#include "SVGLength.h"
#include "Utils.h"

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
REACT_STRUCT(SvgViewProps)
struct SvgViewProps : SvgViewPropsT<SvgViewProps> {
  SvgViewProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept;

  REACT_FIELD(bbWidth)
  winrt::RNSVG::SVGLength bbWidth{0.0, winrt::RNSVG::LengthType::Unknown};

  REACT_FIELD(bbHeight)
  winrt::RNSVG::SVGLength bbHeight{0.0, winrt::RNSVG::LengthType::Unknown};

  REACT_FIELD(minX)
  float minX;
  REACT_FIELD(minY)
  float minY;
  REACT_FIELD(vbWidth)
  float vbWidth;
  REACT_FIELD(vbHeight)
  float vbHeight;
  REACT_FIELD(align)
  std::string align;
  REACT_FIELD(meetOrSlice)
  RNSVG::MeetOrSlice meetOrSlice{RNSVG::MeetOrSlice::Meet};
  REACT_FIELD(tintColor)
  winrt::Microsoft::ReactNative::Color tintColor{nullptr};
  REACT_FIELD(color)
  winrt::Microsoft::ReactNative::Color color{nullptr};

 private:
  winrt::Microsoft::ReactNative::ViewProps m_props{nullptr};
};
#endif

struct SvgView : SvgViewT<SvgView> {
 public:
  SvgView() = default;

#ifdef USE_FABRIC
  SvgView(const winrt::Microsoft::ReactNative::Composition::CreateCompositionComponentViewArgs &args);

  winrt::Microsoft::ReactNative::ComponentView SvgParent() { return Parent(); }
  winrt::Microsoft::ReactNative::Color CurrentColor() { return m_currentColor; }

  // IRenderableFabric
  void UpdateProperties(
      const winrt::Microsoft::ReactNative::IComponentProps &props,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
      bool forceUpdate = true,
      bool invalidate = true);

  // Overrides
  // IInternalCreateVisual
  winrt::Microsoft::ReactNative::Composition::Experimental::IVisual CreateInternalVisual();

  // ComponentView
  void UpdateProps(
      const winrt::Microsoft::ReactNative::IComponentProps &props,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps) noexcept;
  void UpdateLayoutMetrics(
      const winrt::Microsoft::ReactNative::LayoutMetrics &metrics,
      const winrt::Microsoft::ReactNative::LayoutMetrics &oldMetrics);
  void MountChildComponentView(
      const winrt::Microsoft::ReactNative::ComponentView &childComponentView,
      uint32_t index) noexcept;
  void UnmountChildComponentView(
      const winrt::Microsoft::ReactNative::ComponentView &childComponentView,
      uint32_t index) noexcept;
  void OnThemeChanged() noexcept;

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;
#else
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
#endif

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
#ifdef USE_FABRIC
  winrt::Microsoft::ReactNative::Composition::Experimental::ISpriteVisual m_visual{nullptr};
  winrt::Microsoft::ReactNative::Color m_currentColor{nullptr};
  winrt::Microsoft::ReactNative::LayoutMetrics m_layoutMetrics{{0, 0, 0, 0}, 1.0};
  winrt::Microsoft::ReactNative::Composition::Experimental::ICompositionContext m_compContext{nullptr};
#else
  bool m_loaded{false};
  xaml::FrameworkElement m_parent{nullptr};
  xaml::Controls::Image m_image;
  Windows::UI::Color m_currentColor{Colors::Black()};

  xaml::FrameworkElement::Loaded_revoker m_panelLoadedRevoker{};
  xaml::FrameworkElement::Unloaded_revoker m_panelUnloadedRevoker{};
#endif

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
