#pragma once

#ifdef USE_FABRIC
#include "RadialGradientProps.g.h"
#endif

#include "RadialGradientView.g.h"
#include "BrushView.h"

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
REACT_STRUCT(RadialGradientProps)
struct RadialGradientProps : RadialGradientPropsT<RadialGradientProps, SvgGroupCommonProps> {
  RadialGradientProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(fx)
  RNSVG::SVGLength fx{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(fy)
  RNSVG::SVGLength fy{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(cx)
  RNSVG::SVGLength cx{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(cy)
  RNSVG::SVGLength cy{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(rx)
  RNSVG::SVGLength rx{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(ry)
  RNSVG::SVGLength ry{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(gradient)
  std::optional<std::vector<float>> gradient{};
  REACT_FIELD(gradientUnits)
  std::optional<int32_t> gradientUnits;
  REACT_FIELD(gradientTransform)
  std::optional<std::vector<float>> gradientTransform;
};
#endif

struct RadialGradientView : RadialGradientViewT<RadialGradientView, RNSVG::implementation::BrushView> {
 public:
  RadialGradientView() = default;

#ifdef USE_FABRIC
  RadialGradientView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args);

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
  void Unload();

 private:
  RNSVG::SVGLength m_fx{};
  RNSVG::SVGLength m_fy{};
  RNSVG::SVGLength m_rx{};
  RNSVG::SVGLength m_ry{};
  RNSVG::SVGLength m_cx{};
  RNSVG::SVGLength m_cy{};
  std::vector<D2D1_GRADIENT_STOP> m_stops{};
  std::string m_gradientUnits{"objectBoundingBox"};

#ifdef USE_FABRIC
  com_ptr<RadialGradientProps> m_props;
#endif

  // BrushView
  void CreateBrush();
  void UpdateBounds();
  void SetPoints(ID2D1RadialGradientBrush *brush, D2D1_RECT_F bounds);
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct RadialGradientView : RadialGradientViewT<RadialGradientView, implementation::RadialGradientView> {};
} // namespace winrt::RNSVG::factory_implementation
