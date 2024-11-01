#pragma once

#include "RadialGradientProps.g.h"

#include "GroupView.h"

namespace winrt::RNSVG::implementation {

struct SvgRadialGradientStop {
  float offset{0};
  D2D1_COLOR_F color;
  float opacity{1.0f};
};

REACT_STRUCT(RadialGradientProps)
struct RadialGradientProps : RadialGradientPropsT<RadialGradientProps, SvgGroupCommonProps> {
  RadialGradientProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;
  REACT_SVG_GROUP_COMMON_PROPS;

  REACT_FIELD(fx)
  std::optional<std::wstring> fx;
  REACT_FIELD(fy)
  std::optional<std::wstring> fy;
  REACT_FIELD(cx)
  std::optional<std::wstring> cx;
  REACT_FIELD(cy)
  std::optional<std::wstring> cy;
  REACT_FIELD(rx)
  std::optional<std::wstring> rx;
  REACT_FIELD(ry)
  std::optional<std::wstring> ry;
  REACT_FIELD(gradient)
  std::optional<std::vector<winrt::Microsoft::ReactNative::JSValue>> gradient{};
  REACT_FIELD(gradientUnits)
  std::optional<int32_t> gradientUnits;
  REACT_FIELD(gradientTransform)
  std::optional<std::vector<float>> gradientTransform;
};

struct RadialGradientView : winrt::implements<RadialGradientView, IInspectable, RenderableView> {
 public:
  RadialGradientView() = default;

  void UpdateProps(
      const winrt::Microsoft::ReactNative::ComponentView & /*view*/,
      const winrt::Microsoft::ReactNative::IComponentProps &props,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps) noexcept override;
  const wchar_t *GetSvgElementName() noexcept override;
  void OnRender(ID2D1SvgDocument& /*document*/, ID2D1SvgElement& /*element*/) noexcept override;

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;

 private:
  std::vector<SvgRadialGradientStop> m_stops;
};

} // namespace winrt::RNSVG::implementation
