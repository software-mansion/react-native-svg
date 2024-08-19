#pragma once

#ifdef USE_FABRIC
#include "MaskProps.g.h"
#endif

#include "MaskView.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
REACT_STRUCT(MaskProps)
struct MaskProps : MaskPropsT<MaskProps, SvgGroupCommonProps> {
  MaskProps(const winrt::Microsoft::ReactNative::ViewProps &props);

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
  REACT_FIELD(maskUnits)
  uint32_t maskUnits{0};
  REACT_FIELD(maskContentUnits)
  uint32_t maskContentUnits{0};
};
#endif

struct MaskView : MaskViewT<MaskView, RNSVG::implementation::GroupView> {
 public:
  MaskView() = default;

#ifdef USE_FABRIC
  MaskView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args);

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
  com_ptr<MaskProps> m_props;
#endif

};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct MaskView : MaskViewT<MaskView, implementation::MaskView> {};
} // namespace winrt::RNSVG::factory_implementation
