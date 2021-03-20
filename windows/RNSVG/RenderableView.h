#pragma once

#include "RenderableView.g.h"
#include "SVGLength.h"

namespace winrt::RNSVG::implementation {
struct RenderableView : RenderableViewT<RenderableView> {
 public:
  RenderableView() = default;

  Windows::UI::Xaml::FrameworkElement SvgParent() { return m_parent; }
  void SvgParent(Windows::UI::Xaml::FrameworkElement const &value) { m_parent = value; }

  Windows::UI::Color Fill() { return m_fill; }
  void Fill(Windows::UI::Color const &value) { m_fill = value; }

  float FillOpacity() { return m_fillOpacity; }
  void FillOpacity(float value) { m_fillOpacity = value; }

  Windows::UI::Color Stroke() { return m_stroke; }
  void Stroke(Windows::UI::Color const &value) { m_stroke = value; }

  float StrokeOpacity() { return m_strokeOpacity; }
  void StrokeOpacity(float value) { m_strokeOpacity = value; }

  float StrokeMiterLimit() { return m_strokeMiterLimit; }
  void StrokeMiterLimit(float value) { m_strokeMiterLimit = value; }

  float StrokeDashOffset() { return m_strokeDashOffset; }
  void StrokeDashOffset(float value) { m_strokeDashOffset = value; }

  RNSVG::SVGLength StrokeWidth() { return m_strokeWidth; }
  void StrokeWidth(RNSVG::SVGLength const &value) { m_strokeWidth = value; }

  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> StrokeDashArray() { return m_strokeDashArray; }

  Microsoft::Graphics::Canvas::Geometry::CanvasCapStyle StrokeLineCap() { return m_strokeLineCap; }
  void StrokeLineCap(Microsoft::Graphics::Canvas::Geometry::CanvasCapStyle const &value) { m_strokeLineCap = value; }

  Microsoft::Graphics::Canvas::Geometry::CanvasLineJoin StrokeLineJoin() { return m_strokeLineJoin; }
  void StrokeLineJoin(Microsoft::Graphics::Canvas::Geometry::CanvasLineJoin const &value) { m_strokeLineJoin = value; }

  Microsoft::Graphics::Canvas::Geometry::CanvasFilledRegionDetermination FillRule() { return m_fillRule; }
  void FillRule(Microsoft::Graphics::Canvas::Geometry::CanvasFilledRegionDetermination const &value) { m_fillRule = value; }

  void InvalidateCanvas();
  virtual void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool invalidate = true);

  virtual void Render(
      Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &canvas,
      Microsoft::Graphics::Canvas::CanvasDrawingSession const &session) = 0;

 private:
  Microsoft::ReactNative::IReactContext m_reactContext{nullptr};

  Windows::UI::Xaml::FrameworkElement m_parent{nullptr};
  Windows::UI::Color m_fill{Windows::UI::Colors::Transparent()};
  Windows::UI::Color m_stroke{Windows::UI::Colors::Transparent()};
  float m_fillOpacity{1.0f};
  float m_strokeOpacity{1.0f};
  float m_strokeMiterLimit{0.0f};
  float m_strokeDashOffset{0.0f};
  RNSVG::SVGLength m_strokeWidth{};
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> m_strokeDashArray{
      winrt::single_threaded_vector<RNSVG::SVGLength>()};
  Microsoft::Graphics::Canvas::Geometry::CanvasCapStyle m_strokeLineCap{
      Microsoft::Graphics::Canvas::Geometry::CanvasCapStyle::Flat};
  Microsoft::Graphics::Canvas::Geometry::CanvasLineJoin m_strokeLineJoin{
      Microsoft::Graphics::Canvas::Geometry::CanvasLineJoin::Miter};
  Microsoft::Graphics::Canvas::Geometry::CanvasFilledRegionDetermination m_fillRule{
      Microsoft::Graphics::Canvas::Geometry::CanvasFilledRegionDetermination::Winding};

  std::map<RNSVG::BaseProp, bool> m_propSetMap{
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
};
} // namespace winrt::RNSVG::implementation
