#pragma once

#include "RenderableView.g.h"
#include "../SVGLength.h"

#ifdef USE_FABRIC
#include "SvgNodeCommonProps.g.h"
#include "SvgRenderableCommonProps.g.h"

#include <JSValueComposition.h>
#endif

#include <NativeModules.h>
#include "SvgStrings.h"

namespace winrt::Microsoft::ReactNative {
void WriteValue(IJSValueWriter const &writer, const D2D1_SVG_LENGTH &value) noexcept;
void ReadValue(IJSValueReader const &reader, /*out*/ D2D1_SVG_LENGTH &value) noexcept;
} // namespace winrt::Microsoft::ReactNative

namespace winrt::RNSVG::implementation {

struct SvgView;
struct SvgRenderableCommonProps;

void SetCommonSvgProps(
    const SvgView& svgView,
    ID2D1SvgDocument &document,
    ID2D1SvgElement &element,
    const SvgRenderableCommonProps &commonProps) noexcept;

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
    return winrt::Microsoft::ReactNative::TakeJSValue(writer).Equals(winrt::Microsoft::ReactNative::TakeJSValue(rhsWriter));
  }

  bool operator!=(const ColorStruct &rhs) const {
    return !(*this == rhs);
  }
};

// Currently no good way to do inheritance in REACT_STRUCTS
#define REACT_SVG_NODE_COMMON_PROPS \
  REACT_FIELD(name)                 \
  REACT_FIELD(opacity)              \
  REACT_FIELD(matrix)               \
  REACT_FIELD(mask)                 \
  REACT_FIELD(markerStart)          \
  REACT_FIELD(markerMid)            \
  REACT_FIELD(markerEnd)            \
  REACT_FIELD(clipPath)             \
  REACT_FIELD(clipRule)             \
  REACT_FIELD(responsible)          \
  REACT_FIELD(display)              \
  REACT_FIELD(pointerEvents)

REACT_STRUCT(SvgNodeCommonProps)
struct SvgNodeCommonProps : SvgNodeCommonPropsT<SvgNodeCommonProps> {
  SvgNodeCommonProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  virtual void SetProp(
      uint32_t hash,
      winrt::hstring propName,
      winrt::Microsoft::ReactNative::IJSValueReader value) noexcept;

  REACT_SVG_NODE_COMMON_PROPS;

  std::optional<std::wstring> name;
  std::optional<float> opacity;               // 1.0f
  std::optional<std::vector<float>> matrix;
  std::optional<std::string> mask;
  std::optional<std::string> markerStart;
  std::optional<std::string> markerMid;
  std::optional<std::string> markerEnd;
  std::optional<std::wstring> clipPath;

  static_assert(D2D1_FILL_MODE::D2D1_FILL_MODE_WINDING == 1); // NonZero
  static_assert(D2D1_FILL_MODE::D2D1_FILL_MODE_ALTERNATE == 0); // EvenOdd
  std::optional<D2D1_FILL_MODE> clipRule;
  std::optional<bool> responsible;
  std::optional<std::string> display;
  std::optional<std::string> pointerEvents;

 private:
  winrt::Microsoft::ReactNative::ViewProps m_props{nullptr};
};

// Currently no good way to do inheritance in REACT_STRUCTS
#define REACT_SVG_RENDERABLE_COMMON_PROPS \
  REACT_FIELD(fill)                       \
  REACT_FIELD(fillOpacity)                \
  REACT_FIELD(fillRule)                   \
  REACT_FIELD(stroke)                     \
  REACT_FIELD(strokeOpacity)              \
  REACT_FIELD(strokeWidth)                \
  REACT_FIELD(strokeLinecap)              \
  REACT_FIELD(strokeLinejoin)             \
  REACT_FIELD(strokeDasharray)            \
  REACT_FIELD(strokeDashoffset)           \
  REACT_FIELD(strokeMiterlimit)           \
  REACT_FIELD(vectorEffect)               \
  REACT_FIELD(propList)

REACT_STRUCT(SvgRenderableCommonProps)
struct SvgRenderableCommonProps
    : SvgRenderableCommonPropsT<SvgRenderableCommonProps, SvgNodeCommonProps> {
  SvgRenderableCommonProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(
      uint32_t hash,
      winrt::hstring propName,
      winrt::Microsoft::ReactNative::IJSValueReader value) noexcept override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;

  std::optional<winrt::Microsoft::ReactNative::Color> color;
  std::optional<ColorStruct> fill; // TODO should handle setting a color directly - which would need a custom reader to read a explict color into a ColorStruct
  std::optional<float> fillOpacity;         // 1.0f

  static_assert(D2D1_FILL_MODE::D2D1_FILL_MODE_WINDING == 1); // NonZero
  static_assert(D2D1_FILL_MODE::D2D1_FILL_MODE_ALTERNATE == 0); // EvenOdd
  std::optional<D2D1_FILL_MODE> fillRule;
  std::optional<ColorStruct> stroke; // TODO should handle setting a color directly - which would need a custom reader to read a explict color into a ColorStruct
  std::optional<float> strokeOpacity;       // 1.0f
  std::optional<D2D1_SVG_LENGTH> strokeWidth;
  std::optional<uint32_t> strokeLinecap;
  std::optional<D2D1_SVG_LINE_JOIN> strokeLinejoin;
  std::optional<std::vector<D2D1_SVG_LENGTH>> strokeDasharray;
  std::optional<float> strokeDashoffset;
  std::optional<float> strokeMiterlimit;
  std::optional<int32_t> vectorEffect;      // 0
  std::optional<std::vector<std::string>> propList;
};

struct RenderableView : RenderableViewT<RenderableView> {
 public:
  RenderableView() = default;

  virtual const wchar_t* GetSvgElementName() noexcept = 0;

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

  const winrt::Windows::Foundation::Collections::IVector<IRenderable> &Children() const noexcept;

  ID2D1SvgElement &Render(const SvgView &svgView, ID2D1SvgDocument &document, ID2D1SvgElement &svgElement) noexcept;

  virtual void OnRender(ID2D1SvgDocument &document, ID2D1SvgElement & /*svgElement*/) noexcept;
  virtual bool IsSupported() const noexcept;

  RNSVG::SvgView SvgRoot();

  void Invalidate(const winrt::Microsoft::ReactNative::ComponentView &view);

 protected:
  winrt::com_ptr<SvgRenderableCommonProps> m_props;

 private:
  winrt::com_ptr<ID2D1SvgElement> m_spD2DSvgElement;
  Microsoft::ReactNative::IReactContext m_reactContext{nullptr}; // TODO need?
};
} // namespace winrt::RNSVG::implementation

template<typename TProps, typename TUserData>
void RegisterRenderableComponent(const winrt::hstring& name, const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  builder.AddViewComponent(
      name, [](winrt::Microsoft::ReactNative::IReactViewComponentBuilder const &builder) noexcept {
        builder.SetComponentViewInitializer([](const winrt::Microsoft::ReactNative::ComponentView &view) noexcept {
          auto userData = winrt::make_self<TUserData>();
          view.UserData(*userData);
        });
        builder.SetCreateProps([](winrt::Microsoft::ReactNative::ViewProps props) noexcept {
          return winrt::make<TProps>(props);
        });
        builder.SetUpdatePropsHandler([](const winrt::Microsoft::ReactNative::ComponentView &view,
                                         const winrt::Microsoft::ReactNative::IComponentProps &newProps,
                                         const winrt::Microsoft::ReactNative::IComponentProps &oldProps) noexcept {
          auto userData = view.UserData().as<TUserData>();
          userData->UpdateProps(view, newProps, oldProps);
        });
        builder.SetFinalizeUpdateHandler(
            [](const winrt::Microsoft::ReactNative::ComponentView &view,
               const winrt::Microsoft::ReactNative::ComponentViewUpdateMask mask) noexcept {
              auto userData = view.UserData().as<TUserData>();
              userData->FinalizeUpates(view, mask);
            });
        builder.SetMountChildComponentViewHandler(
            [](const winrt::Microsoft::ReactNative::ComponentView &view,
               const winrt::Microsoft::ReactNative::MountChildComponentViewArgs &args) noexcept {
              auto userData = view.UserData().as<TUserData>();
              return userData->MountChildComponentView(view, args);
            });
        builder.SetUnmountChildComponentViewHandler(
            [](const winrt::Microsoft::ReactNative::ComponentView &view,
               const winrt::Microsoft::ReactNative::UnmountChildComponentViewArgs &args) noexcept {
              auto userData = view.UserData().as<TUserData>();
              return userData->UnmountChildComponentView(view, args);
            });
      });
}
