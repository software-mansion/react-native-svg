#pragma once

#include "RenderableView.g.h"
#include "SVGLength.h"

namespace winrt::RNSVG::implementation {
struct RenderableView : RenderableViewT<RenderableView> {
 public:
  RenderableView() = default;
  RenderableView(Microsoft::ReactNative::IReactContext const &context) : m_reactContext(context) {}

  RNSVG::SvgView SvgRoot();

  Windows::UI::Xaml::FrameworkElement SvgParent() { return m_parent; }
  void SvgParent(Windows::UI::Xaml::FrameworkElement const &value) { m_parent = value; }

  Microsoft::Graphics::Canvas::Geometry::CanvasGeometry Geometry() { return m_geometry; }
  void Geometry(Microsoft::Graphics::Canvas::Geometry::CanvasGeometry value) { m_geometry = value; }

  hstring Id() { return m_id; }
  Numerics::float3x2 SvgTransform() { return m_transformMatrix; }

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
  Microsoft::Graphics::Canvas::Geometry::CanvasCapStyle StrokeLineCap() { return m_strokeLineCap; }
  Microsoft::Graphics::Canvas::Geometry::CanvasLineJoin StrokeLineJoin() { return m_strokeLineJoin; }
  Microsoft::Graphics::Canvas::Geometry::CanvasFilledRegionDetermination FillRule() { return m_fillRule; }

  virtual void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate = true, bool invalidate = true);
  virtual void CreateGeometry(Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const & /*canvas*/) {}
  virtual void MergeProperties(RNSVG::RenderableView const &other);
  virtual void SaveDefinition();
  virtual void Unload();
  virtual void Render(
      Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &canvas,
      Microsoft::Graphics::Canvas::CanvasDrawingSession const &session);
  virtual void CreateResources(
      Microsoft::Graphics::Canvas::ICanvasResourceCreator const & /*resourceCreator*/,
      Microsoft::Graphics::Canvas::UI::CanvasCreateResourcesEventArgs const & /*args*/) { }

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
  Microsoft::Graphics::Canvas::Geometry::CanvasGeometry m_geometry{nullptr};
  bool m_recreateResources{true};

  hstring m_id{L""};
  Numerics::float3x2 m_transformMatrix{Numerics::make_float3x2_rotation(0)};
  Windows::UI::Color m_fill{Windows::UI::Colors::Black()};
  Windows::UI::Color m_stroke{Windows::UI::Colors::Transparent()};
  hstring m_fillBrushId{L""};
  hstring m_strokeBrushId{L""};
  float m_fillOpacity{1.0f};
  float m_strokeOpacity{1.0f};
  float m_strokeMiterLimit{0.0f};
  float m_strokeDashOffset{0.0f};
  RNSVG::SVGLength m_strokeWidth{1.0f, RNSVG::LengthType::Pixel};
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> m_strokeDashArray{
      winrt::single_threaded_vector<RNSVG::SVGLength>()};
  Microsoft::Graphics::Canvas::Geometry::CanvasCapStyle m_strokeLineCap{
      Microsoft::Graphics::Canvas::Geometry::CanvasCapStyle::Flat};
  Microsoft::Graphics::Canvas::Geometry::CanvasLineJoin m_strokeLineJoin{
      Microsoft::Graphics::Canvas::Geometry::CanvasLineJoin::Miter};
  Microsoft::Graphics::Canvas::Geometry::CanvasFilledRegionDetermination m_fillRule{
      Microsoft::Graphics::Canvas::Geometry::CanvasFilledRegionDetermination::Winding};
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct RenderableView : RenderableViewT<RenderableView, implementation::RenderableView> {};
} // namespace winrt::RNSVG::factory_implementation
