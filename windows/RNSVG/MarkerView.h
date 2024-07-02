#pragma once

#ifdef USE_FABRIC
#include "MarkerProps.g.h"
#endif

#include "MarkerView.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
REACT_STRUCT(MarkerProps)
struct MarkerProps : MarkerPropsT<MarkerProps, SvgGroupCommonProps> {
  MarkerProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(refX)
  RNSVG::SVGLength refX{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(refY)
  RNSVG::SVGLength refY{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(markerHeight)
  RNSVG::SVGLength markerHeight{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(markerWidth)
  RNSVG::SVGLength markerWidth{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(markerUnits)
  std::string markerUnits{""};
  REACT_FIELD(orient)
  std::string orient{""};
  REACT_FIELD(minX)
  float minX{0.0f};
  REACT_FIELD(minY)
  float minY{0.0f};
  REACT_FIELD(vbWidth)
  float vbWidth{0.0f};
  REACT_FIELD(vbHeight)
  float vbHeight{0.0f};
  REACT_FIELD(align)
  std::string align{""};
  REACT_FIELD(meetOrSlice)
  RNSVG::MeetOrSlice meetOrSlice{RNSVG::MeetOrSlice::Meet};
};
#endif

struct MarkerView : MarkerViewT<MarkerView, RNSVG::implementation::GroupView> {
 public:
  MarkerView() = default;

#ifdef USE_FABRIC
  MarkerView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args);

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;
  
  // IRenderableFabric
  void UpdateProperties(
      const winrt::Microsoft::ReactNative::IComponentProps &props,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
      bool forceUpdate = true,
      bool invalidate = true) noexcept override;
#endif

  // IRenderable
  void Draw(RNSVG::D2DDeviceContext const & /*deviceContext*/, Windows::Foundation::Size const & /*size*/){};

 private:

#ifdef USE_FABRIC
  com_ptr<MarkerProps> m_props;
#endif

};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct MarkerView : MarkerViewT<MarkerView, implementation::MarkerView> {};
} // namespace winrt::RNSVG::factory_implementation
