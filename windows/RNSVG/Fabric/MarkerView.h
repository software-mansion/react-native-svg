#pragma once

#include "MarkerProps.g.h"
#include "MarkerView.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {

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

struct MarkerView : MarkerViewT<MarkerView, RNSVG::implementation::GroupView> {
 public:
  MarkerView() = default;

  const wchar_t *GetSvgElementName() noexcept override;
  bool IsSupported() const noexcept override;

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;
};

} // namespace winrt::RNSVG::implementation
