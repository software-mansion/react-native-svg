#pragma once

#include "RenderableView.g.h"
#include "SVGLength.h"
#include "D2DDeviceContext.h"
#include "D2DGeometry.h"

namespace winrt::RNSVG::implementation {
struct RenderableView : RenderableViewT<RenderableView> {
 public:
  RenderableView() = default;
  RenderableView(Microsoft::ReactNative::IReactContext const &context) : m_reactContext(context) {}

  RNSVG::SvgView SvgRoot();

  Windows::UI::Xaml::FrameworkElement SvgParent() { return m_parent; }
  void SvgParent(Windows::UI::Xaml::FrameworkElement const &value) { m_parent = value; }

  RNSVG::D2DGeometry Geometry() { return m_geometry; }
  void Geometry(RNSVG::D2DGeometry const &value) { m_geometry = value; }

  hstring Id() { return m_id; }
  Numerics::float3x2 SvgTransform() { return m_transformMatrix; }

  bool IsResponsible() { return m_isResponsible; }
  void IsResponsible(bool isResponsible) { m_isResponsible = isResponsible; }

  hstring FillBrushId() { return m_fillBrushId; }
  Windows::UI::Color Fill() { return m_fill; }
  float FillOpacity() { return m_fillOpacity; }
  hstring StrokeBrushId() { return m_strokeBrushId; }
  Windows::UI::Color Stroke() { return m_stroke; }
  float StrokeOpacity() { return m_strokeOpacity; }
  float StrokeMiterLimit() { return m_strokeMiterLimit; }
  float StrokeDashOffset() { return m_strokeDashOffset; }
  RNSVG::SVGLength StrokeWidth() { return m_strokeWidth; }
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> StrokeDashArray() { return m_strokeDashArray; }
  RNSVG::LineCap StrokeLineCap() { return m_strokeLineCap; }
  RNSVG::LineJoin StrokeLineJoin() { return m_strokeLineJoin; }
  RNSVG::FillRule FillRule() { return m_fillRule; }
  RNSVG::D2DGeometry ClipPathGeometry();

  virtual void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate = true, bool invalidate = true);
  virtual void CreateGeometry() {}
  virtual void MergeProperties(RNSVG::RenderableView const &other);
  virtual void SaveDefinition();
  virtual void Unload();
  virtual void Draw(RNSVG::D2DDeviceContext const &deviceContext, Windows::Foundation::Size const &size);
  virtual void CreateResources() {}
  virtual RNSVG::IRenderable HitTest(Windows::Foundation::Point const &point);

 protected:
  float m_opacity{1.0f};
  std::vector<std::string> m_propList{};
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
  Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
  Windows::UI::Xaml::FrameworkElement m_parent{nullptr};
  RNSVG::D2DGeometry m_geometry{nullptr};
  bool m_recreateResources{true};
  bool m_isResponsible{false};
  
  hstring m_id{L""};
  hstring m_clipPathId{L""};
  Numerics::float3x2 m_transformMatrix{Numerics::make_float3x2_rotation(0)};
  Windows::UI::Color m_fill{Windows::UI::Colors::Black()};
  Windows::UI::Color m_stroke{Windows::UI::Colors::Transparent()};
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

  void SetColor(const Microsoft::ReactNative::JSValueObject &propValue, Windows::UI::Color const &fallbackColor, std::string propName);
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct RenderableView : RenderableViewT<RenderableView, implementation::RenderableView> {};
} // namespace winrt::RNSVG::factory_implementation
