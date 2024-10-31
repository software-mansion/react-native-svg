#pragma once

#include "LinearGradientProps.g.h"
#include "LinearGradientView.g.h"

#include "GroupView.h"

namespace winrt::RNSVG::implementation {

struct SvgLinearGradientStop {
  float offset{0};
  D2D1_COLOR_F color;
  float opacity{1.0f};
};

REACT_STRUCT(LinearGradientProps)
struct LinearGradientProps : LinearGradientPropsT<LinearGradientProps, SvgGroupCommonProps> {
  LinearGradientProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;
  REACT_SVG_GROUP_COMMON_PROPS;

  REACT_FIELD(x1)
  std::optional<std::wstring> x1;
  REACT_FIELD(y1)
  std::optional<std::wstring> y1;
  REACT_FIELD(x2)
  std::optional<std::wstring> x2;
  REACT_FIELD(y2)
  std::optional<std::wstring> y2;
  REACT_FIELD(gradient)
  std::optional<std::vector<winrt::Microsoft::ReactNative::JSValue>> gradient{};
  REACT_FIELD(gradientUnits)
  std::optional<int32_t> gradientUnits;
  REACT_FIELD(gradientTransform)
  std::optional<std::vector<float>> gradientTransform;
};

struct LinearGradientView : LinearGradientViewT<LinearGradientView, RNSVG::implementation::GroupView> {
 public:
  LinearGradientView() = default;

  void UpdateProps(
      const winrt::Microsoft::ReactNative::ComponentView & /*view*/,
      const winrt::Microsoft::ReactNative::IComponentProps &props,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps) noexcept override;

  const wchar_t *GetSvgElementName() noexcept override;
  void OnRender(ID2D1SvgDocument & /*document*/, ID2D1SvgElement & /*element*/) noexcept override;

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;

 private:
  std::vector<SvgLinearGradientStop> m_stops;
};

} // namespace winrt::RNSVG::implementation
