#pragma once

#include "SvgView.h"

#include <JSValueComposition.h>
#include <NativeModules.h>
#include "D2DHelpers.h"
#include "SvgStrings.h"

namespace winrt::Microsoft::ReactNative {
void WriteValue(IJSValueWriter const &writer, const D2D1_SVG_LENGTH &value) noexcept;
void ReadValue(IJSValueReader const &reader, /*out*/ D2D1_SVG_LENGTH &value) noexcept;
} // namespace winrt::Microsoft::ReactNative

namespace winrt::RNSVG::implementation {

REACT_STRUCT(ColorStruct)
struct ColorStruct {
  REACT_FIELD(type)
  int32_t type{-1};

  REACT_FIELD(payload)
  winrt::Microsoft::ReactNative::Color payload{nullptr};

  REACT_FIELD(brushRef)
  std::wstring brushRef;

  bool operator==(const ColorStruct &rhs) const {
    if (type != rhs.type || brushRef != rhs.brushRef)
      return false;

    // When we move to a RNW version that provides Color::Equals switch to that for the payload comparison
    auto writer = winrt::Microsoft::ReactNative::MakeJSValueTreeWriter();
    winrt::Microsoft::ReactNative::WriteValue(writer, payload);
    auto rhsWriter = winrt::Microsoft::ReactNative::MakeJSValueTreeWriter();
    winrt::Microsoft::ReactNative::WriteValue(rhsWriter, rhs.payload);
    return winrt::Microsoft::ReactNative::TakeJSValue(writer).Equals(
        winrt::Microsoft::ReactNative::TakeJSValue(rhsWriter));
  }

  bool operator!=(const ColorStruct &rhs) const {
    return !(*this == rhs);
  }
};

HRESULT SetColorMode(
    const SvgView &svgView,
    ID2D1SvgElement &element,
    const std::wstring &attribute,
    const ColorStruct &colorProp) noexcept;

// Currently no good way to do inheritance in REACT_STRUCTS
#define REACT_SVG_RENDERABLE_COMMON_PROPS                      \
  REACT_FIELD(name)                                            \
  std::optional<std::wstring> name;                            \
  REACT_FIELD(opacity)                                         \
  std::optional<float> opacity;                                \
  REACT_FIELD(matrix)                                          \
  std::optional<std::vector<float>> matrix;                    \
  REACT_FIELD(clipPath)                                        \
  std::optional<std::wstring> clipPath;                        \
  REACT_FIELD(clipRule)                                        \
  std::optional<D2D1_FILL_MODE> clipRule;                      \
  REACT_FIELD(fill)                                            \
  std::optional<ColorStruct> fill;                             \
  REACT_FIELD(fillOpacity)                                     \
  std::optional<float> fillOpacity;                            \
  REACT_FIELD(fillRule)                                        \
  std::optional<D2D1_FILL_MODE> fillRule;                      \
  REACT_FIELD(stroke)                                          \
  std::optional<ColorStruct> stroke;                           \
  REACT_FIELD(strokeOpacity)                                   \
  std::optional<float> strokeOpacity;                          \
  REACT_FIELD(strokeWidth)                                     \
  std::optional<D2D1_SVG_LENGTH> strokeWidth;                  \
  REACT_FIELD(strokeLinecap)                                   \
  std::optional<uint32_t> strokeLinecap;                       \
  REACT_FIELD(strokeLinejoin)                                  \
  std::optional<D2D1_SVG_LINE_JOIN> strokeLinejoin;            \
  REACT_FIELD(strokeDasharray)                                 \
  std::optional<std::vector<D2D1_SVG_LENGTH>> strokeDasharray; \
  REACT_FIELD(strokeDashoffset)                                \
  std::optional<float> strokeDashoffset;                       \
  REACT_FIELD(strokeMiterlimit)                                \
  std::optional<float> strokeMiterlimit;                       \
  REACT_FIELD(propList)                                        \
  std::optional<std::vector<std::string>> propList;            \
  std::optional<winrt::Microsoft::ReactNative::Color> color;   \
  winrt::Microsoft::ReactNative::ViewProps m_props{nullptr};

#define REACT_SVG_RENDERABLE_COMMON_PROPS_INIT \
  : m_props(props)

#define REACT_BEGIN_SVG_RENDERABLE_COMMON_PROPS_CLONE(TProps) \
     if (cloneFrom) {                                         \
       auto cloneFromProps = cloneFrom.as<TProps>();          \
       name = cloneFromProps->name;                           \
       opacity = cloneFromProps->opacity;                     \
       matrix = cloneFromProps->matrix;                       \
       clipPath = cloneFromProps->clipPath;                   \
       clipRule = cloneFromProps->clipRule;                   \
       fill = cloneFromProps->fill;                           \
       fillOpacity = cloneFromProps->fillOpacity;             \
       fillRule = cloneFromProps->fillRule;                   \
       stroke = cloneFromProps->stroke;                       \
       strokeOpacity = cloneFromProps->strokeOpacity;         \
       strokeWidth = cloneFromProps->strokeWidth;             \
       strokeLinecap = cloneFromProps->strokeLinecap;         \
       strokeLinejoin = cloneFromProps->strokeLinejoin;       \
       strokeDasharray = cloneFromProps->strokeDasharray;     \
       strokeMiterlimit = cloneFromProps->strokeMiterlimit;   \
       propList = cloneFromProps->propList;                   \
       color = cloneFromProps->color;

#define REACT_END_SVG_RENDERABLE_COMMON_PROPS_CLONE \
     }

struct __declspec(uuid("a03986c0-b06e-4fb8-a86e-16fcc47b2f31")) RenderableView : public ::IUnknown {
 public:
  RenderableView() = default;

  virtual const wchar_t *GetSvgElementName() noexcept = 0;

  // ComponentView
  void MountChildComponentView(
      const winrt::Microsoft::ReactNative::ComponentView &view,
      const winrt::Microsoft::ReactNative::MountChildComponentViewArgs &args) noexcept;
  void UnmountChildComponentView(
      const winrt::Microsoft::ReactNative::ComponentView &view,
      const winrt::Microsoft::ReactNative::UnmountChildComponentViewArgs &args) noexcept;

  virtual void UpdateProps(
      const winrt::Microsoft::ReactNative::ComponentView & /*view*/,
      const winrt::Microsoft::ReactNative::IComponentProps &props,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps) noexcept;

  virtual void FinalizeUpates(
      const winrt::Microsoft::ReactNative::ComponentView & /*view*/,
      winrt::Microsoft::ReactNative::ComponentViewUpdateMask mask) noexcept;

  ID2D1SvgElement &Render(const SvgView &svgView, ID2D1SvgDocument &document, ID2D1SvgElement &svgElement) noexcept;

  virtual void OnRender(const SvgView &svgView, ID2D1SvgDocument &document, ID2D1SvgElement & /*svgElement*/) noexcept;
  virtual bool IsSupported() const noexcept;

  void Invalidate(const winrt::Microsoft::ReactNative::ComponentView &view);

 protected:
  winrt::Microsoft::ReactNative::IComponentProps m_props;

 private:
  winrt::com_ptr<ID2D1SvgElement> m_spD2DSvgElement;
};

template <typename TProps>
void SetCommonSvgProps(
    const SvgView &svgView,
    ID2D1SvgDocument &document,
    ID2D1SvgElement &element,
    const TProps &commonProps) noexcept {
  HRESULT hr = S_OK;
  if (commonProps.color != std::nullopt) {
    auto color = commonProps.color.value().AsWindowsColor(svgView.Theme());
    hr |= element.SetAttributeValue(SvgStrings::colorAttributeName, D2DHelpers::AsD2DColor(color));
  }

  if (commonProps.propList) {
    for (auto &prop : commonProps.propList.value()) {
      if (prop == "fill") {
        if (commonProps.fill != std::nullopt)
          hr |= SetColorMode(svgView, element, SvgStrings::fillAttributeName, commonProps.fill.value());
        else
          hr |= element.SetAttributeValue(
              SvgStrings::fillAttributeName,
              D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
              SvgStrings::noneAttributeValue);
      } else if (prop == "fillOpacity") {
        if (commonProps.fillOpacity != std::nullopt)
          hr |= element.SetAttributeValue(SvgStrings::fillOpacityAttributeName, commonProps.fillOpacity.value());
      } else if (prop == "fillRule") {
        if (commonProps.fillRule != std::nullopt) {
          hr |= element.SetAttributeValue(SvgStrings::fillRuleAttributeName, commonProps.fillRule.value());
        }
      } else if (prop == "stroke") {
        if (commonProps.stroke != std::nullopt)
          hr |= SetColorMode(svgView, element, SvgStrings::strokeAttributeName, commonProps.stroke.value());
        else
          hr |= element.SetAttributeValue(
              SvgStrings::strokeAttributeName,
              D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
              SvgStrings::noneAttributeValue);
      } else if (prop == "strokeWidth") {
        if (commonProps.strokeWidth != std::nullopt)
          hr |= element.SetAttributeValue(SvgStrings::strokeWidthAttributeName, commonProps.strokeWidth.value());
      } else if (prop == "strokeOpacity") {
        if (commonProps.strokeOpacity != std::nullopt)
          hr |= element.SetAttributeValue(SvgStrings::strokeOpacityAttributeName, commonProps.strokeOpacity.value());
      } else if (prop == "strokeDasharray") {
        if (commonProps.strokeDasharray != std::nullopt && !commonProps.strokeDasharray->empty()) {
          winrt::com_ptr<ID2D1SvgStrokeDashArray> dashArray;
          document.CreateStrokeDashArray(
              &commonProps.strokeDasharray.value()[0],
              static_cast<UINT32>(commonProps.strokeDasharray.value().size()),
              dashArray.put());
          hr |= element.SetAttributeValue(SvgStrings::strokeDashArrayAttributeName, dashArray.get());
        }
      } else if (prop == "strokeDashoffset") {
        if (commonProps.strokeDashoffset != std::nullopt) {
          hr |= element.SetAttributeValue(
              SvgStrings::strokeDashOffsetAttributeName, commonProps.strokeDashoffset.value());
        }
      } else if (prop == "strokeLinecap") {
        if (commonProps.strokeLinecap != std::nullopt) {
          static D2D1_SVG_LINE_CAP supportedCaps[] = {
              D2D1_SVG_LINE_CAP_BUTT, D2D1_SVG_LINE_CAP_ROUND, D2D1_SVG_LINE_CAP_SQUARE};
          hr |= element.SetAttributeValue(
              SvgStrings::strokeLinecapAttributeName, supportedCaps[commonProps.strokeLinecap.value()]);
        }
      } else if (prop == "strokeLinejoin") {
        if (commonProps.strokeLinejoin != std::nullopt) {
          static D2D1_SVG_LINE_JOIN supportedJoins[] = {
              D2D1_SVG_LINE_JOIN_MITER, D2D1_SVG_LINE_JOIN_ROUND, D2D1_SVG_LINE_JOIN_BEVEL};
          hr |= element.SetAttributeValue(
              SvgStrings::strokeLinejoinAttributeName, supportedJoins[commonProps.strokeLinejoin.value()]);
        }
      } else if (prop == "strokeMiterlimit") {
        if (commonProps.strokeMiterlimit != std::nullopt) {
          hr |= element.SetAttributeValue(
              SvgStrings::strokeMiterLimitAttributeName, commonProps.strokeMiterlimit.value());
        }
      }
    }
  }

  if (commonProps.clipPath != std::nullopt) {
    std::wstring namedRefStr = L"url(#" + commonProps.clipPath.value() + L")";
    hr |= element.SetAttributeValue(
        SvgStrings::clipPathAttributeName,
        D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
        namedRefStr.c_str());
  }

  if (commonProps.clipRule != std::nullopt) {
    hr |= element.SetAttributeValue(SvgStrings::clipRuleAttributeName, commonProps.clipRule.value());
  }

  if (commonProps.name != std::nullopt)
    hr |= element.SetAttributeValue(
        SvgStrings::idAttributeName,
        D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
        commonProps.name.value().c_str());

  if (commonProps.opacity != std::nullopt)
    hr |= element.SetAttributeValue(SvgStrings::opacityAttributeName, commonProps.opacity.value());

  if (commonProps.matrix != std::nullopt) {
    auto &matrix = commonProps.matrix.value();
    hr |= element.SetAttributeValue(
        SvgStrings::transformAttributeName,
        D2D1_MATRIX_3X2_F{matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]});
  }

  assert(hr == S_OK);
}
} // namespace winrt::RNSVG::implementation

template <typename TProps, typename TUserData>
void RegisterRenderableComponent(
    const winrt::hstring &name,
    const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  builder.AddViewComponent(name, [](winrt::Microsoft::ReactNative::IReactViewComponentBuilder const &builder) noexcept {
    builder.SetComponentViewInitializer([](const winrt::Microsoft::ReactNative::ComponentView &view) noexcept {
      auto userData = winrt::make_self<TUserData>();
      view.UserData(*userData);
    });
    builder.SetCreateProps(
        [](winrt::Microsoft::ReactNative::ViewProps props, const winrt::Microsoft::ReactNative::IComponentProps &cloneFrom) noexcept { return winrt::make<TProps>(props, cloneFrom); });
    builder.SetUpdatePropsHandler([](const winrt::Microsoft::ReactNative::ComponentView &view,
                                     const winrt::Microsoft::ReactNative::IComponentProps &newProps,
                                     const winrt::Microsoft::ReactNative::IComponentProps &oldProps) noexcept {
      auto userData = winrt::get_self<TUserData>(view.UserData());
      userData->UpdateProps(view, newProps, oldProps);
    });
    builder.SetFinalizeUpdateHandler([](const winrt::Microsoft::ReactNative::ComponentView &view,
                                        const winrt::Microsoft::ReactNative::ComponentViewUpdateMask mask) noexcept {
      auto userData = winrt::get_self<TUserData>(view.UserData());
      userData->FinalizeUpates(view, mask);
    });
    builder.SetMountChildComponentViewHandler(
        [](const winrt::Microsoft::ReactNative::ComponentView &view,
           const winrt::Microsoft::ReactNative::MountChildComponentViewArgs &args) noexcept {
          auto userData = winrt::get_self<TUserData>(view.UserData());
          return userData->MountChildComponentView(view, args);
        });
    builder.SetUnmountChildComponentViewHandler(
        [](const winrt::Microsoft::ReactNative::ComponentView &view,
           const winrt::Microsoft::ReactNative::UnmountChildComponentViewArgs &args) noexcept {
          auto userData = winrt::get_self<TUserData>(view.UserData());
          return userData->UnmountChildComponentView(view, args);
        });
  });
}
