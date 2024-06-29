#pragma once

#ifdef USE_FABRIC
#include "RectProps.g.h"
#endif

#include "RectView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
REACT_STRUCT(RectProps)
struct RectProps : RectPropsT<RectProps, SvgRenderableCommonProps> {
  RectProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(x)
  RNSVG::SVGLength x{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(y)
  RNSVG::SVGLength y{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(height)
  RNSVG::SVGLength height{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(width)
  RNSVG::SVGLength width{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(rx)
  RNSVG::SVGLength rx{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(ry)
  RNSVG::SVGLength ry{0, winrt::RNSVG::LengthType::Unknown};
};
#endif

struct RectView : RectViewT<RectView, RNSVG::implementation::RenderableView> {
 public:
  RectView() = default;

#ifdef USE_FABRIC
  RectView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args);

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
  RNSVG::SVGLength m_width{};
  RNSVG::SVGLength m_height{};
  RNSVG::SVGLength m_x{};
  RNSVG::SVGLength m_y{};
  RNSVG::SVGLength m_rx{};
  RNSVG::SVGLength m_ry{};

#ifdef USE_FABRIC
  com_ptr<RectProps> m_props;
#endif
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct RectView : RectViewT<RectView, implementation::RectView> {};
} // namespace winrt::RNSVG::factory_implementation
