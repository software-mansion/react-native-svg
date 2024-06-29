#pragma once

#ifdef USE_FABRIC
#include "EllipseProps.g.h"
#endif

#include "EllipseView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
REACT_STRUCT(EllipseProps)
struct EllipseProps : EllipsePropsT<EllipseProps, SvgRenderableCommonProps> {
  EllipseProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(cx)
  RNSVG::SVGLength cx{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(cy)
  RNSVG::SVGLength cy{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(rx)
  RNSVG::SVGLength rx{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(ry)
  RNSVG::SVGLength ry{0, winrt::RNSVG::LengthType::Unknown};
};
#endif

struct EllipseView : EllipseViewT<EllipseView, RNSVG::implementation::RenderableView> {
 public:
  EllipseView() = default;

#ifdef USE_FABRIC
  EllipseView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args);

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;
  
  // IRenderableFabric
  void UpdateProperties(
      const winrt::Microsoft::ReactNative::IComponentProps &props,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
      bool forceUpdate = true,
      bool invalidate = true) noexcept override;
#else
  // IRenderablePaper
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
#endif

  // IRenderable
  void CreateGeometry(RNSVG::D2DDeviceContext const &context);
  
 private:
  RNSVG::SVGLength m_cx{};
  RNSVG::SVGLength m_cy{};
  RNSVG::SVGLength m_rx{};
  RNSVG::SVGLength m_ry{};

#ifdef USE_FABRIC
  com_ptr<EllipseProps> m_props;
#endif
};
} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation {
struct EllipseView : EllipseViewT<EllipseView, implementation::EllipseView> {};
} // namespace winrt::RNSVG::factory_implementation
