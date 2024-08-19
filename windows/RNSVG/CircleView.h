#pragma once

#ifdef USE_FABRIC
#include "CircleProps.g.h"
#endif

#include "CircleView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
REACT_STRUCT(CircleProps)
struct CircleProps : CirclePropsT<CircleProps, SvgRenderableCommonProps> {
  CircleProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(r)
  RNSVG::SVGLength r{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(cx)
  RNSVG::SVGLength cx{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(cy)
  RNSVG::SVGLength cy{0, winrt::RNSVG::LengthType::Unknown};
};
#endif

struct CircleView : CircleViewT<CircleView, RNSVG::implementation::RenderableView> {
 public: 
  CircleView() = default;

#ifdef USE_FABRIC
  CircleView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args);

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
  RNSVG::SVGLength m_r{};
  RNSVG::SVGLength m_cx{};
  RNSVG::SVGLength m_cy{};

#ifdef USE_FABRIC
  com_ptr<CircleProps> m_props;
#endif
};
} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation {
struct CircleView : CircleViewT<CircleView, implementation::CircleView> {};
} // namespace winrt::RNSVG::factory_implementation
