#pragma once

#ifdef USE_FABRIC
#include "SvgTextCommonProps.g.h"
#endif

#include "TextView.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
#define REACT_SVG_TEXT_COMMON_PROPS \
  REACT_FIELD(dx)                   \
  REACT_FIELD(dy)                   \
  REACT_FIELD(x)                    \
  REACT_FIELD(y)                    \
  REACT_FIELD(rotate)               \
  REACT_FIELD(inlineSize)           \
  REACT_FIELD(textLength)           \
  REACT_FIELD(baselineShift)        \
  REACT_FIELD(lengthAdjust)         \
  REACT_FIELD(alignmentBaseline)    \
  REACT_FIELD(verticalAlign)           

REACT_STRUCT(SvgTextCommonProps)
struct SvgTextCommonProps : SvgTextCommonPropsT<SvgTextCommonProps, SvgGroupCommonProps> {
  SvgTextCommonProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;
  REACT_SVG_GROUP_COMMON_PROPS;

  std::optional<std::vector<RNSVG::SVGLength>> dx;
  std::optional<std::vector<RNSVG::SVGLength>> dy;
  std::optional<std::vector<RNSVG::SVGLength>> x;
  std::optional<std::vector<RNSVG::SVGLength>> y;
  std::optional<std::vector<RNSVG::SVGLength>> rotate;
  RNSVG::SVGLength inlineSize{0, winrt::RNSVG::LengthType::Unknown};
  RNSVG::SVGLength textLength{0, winrt::RNSVG::LengthType::Unknown};
  RNSVG::SVGLength baselineShift{0, winrt::RNSVG::LengthType::Unknown};
  std::string lengthAdjust;
  std::string alignmentBaseline;
  RNSVG::SVGLength verticalAlign{0, winrt::RNSVG::LengthType::Unknown};
};
#endif

struct TextView : TextViewT<TextView, RNSVG::implementation::GroupView> {
 public:
  TextView() = default;

#ifdef USE_FABRIC
  TextView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args);

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;

  // IRenderableFabric
  virtual void UpdateProperties(
      const winrt::Microsoft::ReactNative::IComponentProps &props,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
      bool forceUpdate = true,
      bool invalidate = true) noexcept;
#else
  // IRenderablePaper
  virtual void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
#endif

  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> X() { return m_x; }
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> Y() { return m_y; }
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> DX() { return m_dx; }
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> DY() { return m_dy; }
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> Rotate() { return m_rotate; }

  // GroupView
  virtual void DrawGroup(RNSVG::D2DDeviceContext const &deviceContext, Windows::Foundation::Size const &size);

 private:
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> m_x{winrt::single_threaded_vector<RNSVG::SVGLength>()};
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> m_y{winrt::single_threaded_vector<RNSVG::SVGLength>()};
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> m_dx{winrt::single_threaded_vector<RNSVG::SVGLength>()};
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> m_dy{winrt::single_threaded_vector<RNSVG::SVGLength>()};
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> m_rotate{winrt::single_threaded_vector<RNSVG::SVGLength>()};

#ifdef USE_FABRIC
  com_ptr<SvgTextCommonProps> m_props;
#endif

};
} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation {
struct TextView : TextViewT<TextView, implementation::TextView> {};
} // namespace winrt::RNSVG::factory_implementation
