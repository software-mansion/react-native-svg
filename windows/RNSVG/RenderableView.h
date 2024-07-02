#pragma once

#include "RenderableView.g.h"
#include "SVGLength.h"
#include "D2DDeviceContext.h"
#include "D2DGeometry.h"

#ifdef USE_FABRIC
#include "SvgNodeCommonProps.g.h"
#include "SvgRenderableCommonProps.g.h"

#include <JSValueComposition.h>
#endif

#include <NativeModules.h>

namespace winrt::RNSVG::implementation {
#ifdef USE_FABRIC
REACT_STRUCT(ColorStruct)
struct ColorStruct {
  REACT_FIELD(type)
  int32_t type{-1};

  REACT_FIELD(payload)
  winrt::Microsoft::ReactNative::Color payload{nullptr};

  REACT_FIELD(brushRef)
  std::string brushRef;

  bool operator==(const ColorStruct &rhs) const {
    return type == rhs.type && payload == rhs.payload && brushRef == rhs.brushRef;
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

  std::optional<std::string> name;
  std::optional<float> opacity;               // 1.0f
  std::optional<std::vector<float>> matrix;
  std::optional<std::string> mask;
  std::optional<std::string> markerStart;
  std::optional<std::string> markerMid;
  std::optional<std::string> markerEnd;
  std::optional<std::string> clipPath;
  std::optional<RNSVG::FillRule> clipRule;    // RNSVG::FillRule::EvenOdd
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

  std::optional<ColorStruct> fill;
  std::optional<float> fillOpacity;         // 1.0f
  std::optional<FillRule> fillRule;         // RNSVG::FillRule::NonZero
  std::optional<ColorStruct> stroke;
  std::optional<float> strokeOpacity;       // 1.0f
  std::optional<RNSVG::SVGLength> strokeWidth;
  std::optional<LineCap> strokeLinecap;     // RNSVG::LineCap::Butt
  std::optional<LineJoin> strokeLinejoin;   // RNSVG::LineJoin::Miter
  std::optional<std::vector<RNSVG::SVGLength>> strokeDasharray;
  std::optional<float> strokeDashoffset;
  std::optional<float> strokeMiterlimit;
  std::optional<int32_t> vectorEffect;      // 0
  std::optional<std::vector<std::string>> propList;
};
#endif

struct RenderableView : RenderableViewT<RenderableView> {
 public:
  RenderableView() = default;

#ifdef USE_FABRIC
  RenderableView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args);

  // IRenderableFabric
  winrt::Microsoft::ReactNative::ComponentView SvgParent() { return Parent(); }
  winrt::Microsoft::ReactNative::Color Fill() { return m_fill; }
  winrt::Microsoft::ReactNative::Color Stroke() { return m_stroke; }

  // ComponentView
  void MountChildComponentView(
      const winrt::Microsoft::ReactNative::ComponentView &childComponentView,
      uint32_t index) noexcept;
  void UnmountChildComponentView(
      const winrt::Microsoft::ReactNative::ComponentView &childComponentView,
      uint32_t index) noexcept;

  virtual void UpdateProps(
      const winrt::Microsoft::ReactNative::IComponentProps &props,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps) noexcept;

  // IRenderableFabric
  virtual void UpdateProperties(
      const winrt::Microsoft::ReactNative::IComponentProps &props,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
      bool forceUpdate = true,
      bool invalidate = true) noexcept;
#else
  RenderableView(Microsoft::ReactNative::IReactContext const &context) : m_reactContext(context) {}

  // IRenderablePaper
  xaml::FrameworkElement SvgParent() { return m_parent; }
  void SvgParent(xaml::FrameworkElement const &value) { m_parent = value; }

  Windows::UI::Color Fill() { return m_fill; }
  Windows::UI::Color Stroke() { return m_stroke; }

  virtual void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate = true, bool invalidate = true);
#endif

  RNSVG::SvgView SvgRoot();

  RNSVG::D2DGeometry Geometry() { return m_geometry; }
  void Geometry(RNSVG::D2DGeometry const &value) { m_geometry = value; }

  hstring Id() { return m_id; }
  Numerics::float3x2 SvgTransform() { return m_transformMatrix; }

  bool IsResponsible() { return m_isResponsible; }
  void IsResponsible(bool isResponsible) { m_isResponsible = isResponsible; }

  bool IsUnloaded() { return m_isUnloaded; }

  hstring FillBrushId() { return m_fillBrushId; }
  float FillOpacity() { return m_fillOpacity; }
  hstring StrokeBrushId() { return m_strokeBrushId; }
  float StrokeOpacity() { return m_strokeOpacity; }
  float StrokeMiterLimit() { return m_strokeMiterLimit; }
  float StrokeDashOffset() { return m_strokeDashOffset; }
  RNSVG::SVGLength StrokeWidth() { return m_strokeWidth; }
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> StrokeDashArray() { return m_strokeDashArray; }
  RNSVG::LineCap StrokeLineCap() { return m_strokeLineCap; }
  RNSVG::LineJoin StrokeLineJoin() { return m_strokeLineJoin; }
  RNSVG::FillRule FillRule() { return m_fillRule; }
  RNSVG::D2DGeometry ClipPathGeometry(RNSVG::D2DDeviceContext const &context);

  // IRenderable
  virtual void CreateGeometry(RNSVG::D2DDeviceContext const & /*context*/) {}
  virtual void MergeProperties(RNSVG::IRenderable const &other);
  virtual void SaveDefinition();
  virtual void Unload();
  virtual void Draw(RNSVG::D2DDeviceContext const &deviceContext, Windows::Foundation::Size const &size);
  virtual void CreateResources() {}
  virtual RNSVG::IRenderable HitTest(Windows::Foundation::Point const &point);

 protected:
#ifndef USE_FABRIC
  std::vector<std::string> m_propList{};
#endif

  float m_opacity{1.0f};
  std::map<RNSVG::BaseProp, bool> m_propSetMap{
      {RNSVG::BaseProp::Matrix, false},
      {RNSVG::BaseProp::Fill, false},
      {RNSVG::BaseProp::FillOpacity, false},
      {RNSVG::BaseProp::FillRule, false},
      {RNSVG::BaseProp::Stroke, false},
      {RNSVG::BaseProp::StrokeOpacity, false},
      {RNSVG::BaseProp::StrokeWidth, false},
      {RNSVG::BaseProp::StrokeMiterLimit, false},
      {RNSVG::BaseProp::StrokeDashOffset, false},
      {RNSVG::BaseProp::StrokeDashArray, false},
      {RNSVG::BaseProp::StrokeLineCap, false},
      {RNSVG::BaseProp::StrokeLineJoin, false},
  };

 private:
#ifdef USE_FABRIC
  winrt::Microsoft::ReactNative::ComponentView m_parent{nullptr};
  winrt::Microsoft::ReactNative::Color m_fill{winrt::Microsoft::ReactNative::Color::Black()};
  winrt::Microsoft::ReactNative::Color m_stroke{winrt::Microsoft::ReactNative::Color::Transparent()};

  void SetColor(
    std::optional<ColorStruct> &propValue,
    winrt::Microsoft::ReactNative::Color const &fallbackColor,
    std::string propName);
#else
  xaml::FrameworkElement m_parent{nullptr};
  Windows::UI::Color m_fill{Colors::Black()};
  Windows::UI::Color m_stroke{Colors::Transparent()};

  void SetColor(const Microsoft::ReactNative::JSValueObject &propValue, Windows::UI::Color const &fallbackColor, std::string propName);
#endif
 
  Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
  RNSVG::D2DGeometry m_geometry{nullptr};
  bool m_recreateResources{true};
  bool m_isResponsible{false};
  bool m_isUnloaded{false};

  hstring m_id{L""};
  hstring m_clipPathId{L""};
  Numerics::float3x2 m_transformMatrix{Numerics::float3x2::identity()};
  hstring m_fillBrushId{L""};
  hstring m_strokeBrushId{L""};
  float m_fillOpacity{1.0f};
  float m_strokeOpacity{1.0f};
  float m_strokeMiterLimit{0.0f};
  float m_strokeDashOffset{0.0f};
  std::vector<float> m_adjustedStrokeDashArray;
  RNSVG::SVGLength m_strokeWidth{1.0f, RNSVG::LengthType::Pixel};
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> m_strokeDashArray{
      winrt::single_threaded_vector<RNSVG::SVGLength>()};
  RNSVG::LineCap m_strokeLineCap{RNSVG::LineCap::Butt};
  RNSVG::LineJoin m_strokeLineJoin{RNSVG::LineJoin::Miter};
  RNSVG::FillRule m_fillRule{RNSVG::FillRule::NonZero};
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct RenderableView : RenderableViewT<RenderableView, implementation::RenderableView> {};
} // namespace winrt::RNSVG::factory_implementation
