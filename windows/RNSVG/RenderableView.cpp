#include "pch.h"
#include "RenderableView.h"
#if __has_include("RenderableView.g.cpp")
#include "RenderableView.g.cpp"
#endif

#include "JSValueXaml.h"
#include "SVGLength.h"
#include "SvgView.h"
#include "Utils.h"

#define _USE_MATH_DEFINES
#include <math.h>

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void RenderableView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap = JSValue::ReadObjectFrom(reader);
  auto const &parent = SvgParent().as<RNSVG::RenderableView>();

  for (auto const &pair : propertyMap) {
    auto const &propertyName = pair.first;
    auto const &propertyValue = pair.second;

    auto prop{RNSVG::BaseProp::Unknown};

    if (propertyName == "strokeWidth") {
      prop = RNSVG::BaseProp::StrokeWidth;
      if (forceUpdate || !m_propSetMap[prop]) {
        if (propertyValue.IsNull()) {
          m_strokeWidth = parent.StrokeWidth();
        } else {
          m_strokeWidth = SVGLength::From(propertyValue);
        }
      }
    } else if (propertyName == "strokeOpacity") {
      prop = RNSVG::BaseProp::StrokeOpacity;
      if (forceUpdate || !m_propSetMap[prop]) {
        if (propertyValue.IsNull()) {
          m_strokeOpacity = parent.StrokeOpacity();
        } else {
          m_strokeOpacity = propertyValue.AsSingle();
        }
      }
    } else if (propertyName == "fillOpacity") {
      prop = RNSVG::BaseProp::FillOpacity;
      if (forceUpdate || !m_propSetMap[prop]) {
        if (propertyValue.IsNull()) {
          m_fillOpacity = parent.FillOpacity();
        } else {
          m_fillOpacity = propertyValue.AsSingle();
        }
      }
    } else if (propertyName == "stroke") {
      prop = RNSVG::BaseProp::Stroke;
      if (forceUpdate || !m_propSetMap[prop]) {
        Windows::UI::Color newColor{Windows::UI::Colors::Transparent()};
        if (parent && propertyValue.IsNull()) {
          newColor = parent.Stroke();
        } else if (auto color = Utils::GetColorFromJSValue(propertyValue)) {
          newColor = color.value();
        }
        m_stroke = newColor;
      }
    } else if (propertyName == "fill") {
      prop = RNSVG::BaseProp::Fill;
      if (forceUpdate || !m_propSetMap[prop]) {
        Windows::UI::Color newColor{Windows::UI::Colors::Transparent()};
        if (parent && propertyValue.IsNull()) {
          newColor = parent.Fill();
        } else if (auto color = Utils::GetColorFromJSValue(propertyValue)) {
          newColor = color.value();
        }
        m_fill = newColor;
      }
    } else if (propertyName == "strokeLinecap") {
      prop = RNSVG::BaseProp::StrokeLineCap;
      if (forceUpdate || !m_propSetMap[prop]) {
        if (propertyValue.IsNull()) {
          m_strokeLineCap = parent.StrokeLineCap();
        } else {
          auto strokeLineCap{propertyValue.AsInt32()};
          switch (strokeLineCap) {
            case 2:
              m_strokeLineCap = Geometry::CanvasCapStyle::Square;
              break;
            case 1:
              m_strokeLineCap = Geometry::CanvasCapStyle::Round;
              break;
            case 0:
            default:
              m_strokeLineCap = Geometry::CanvasCapStyle::Flat;
              break;
          }
        }
      }
    } else if (propertyName == "strokeLinejoin") {
      prop = RNSVG::BaseProp::StrokeLineJoin;
      if (forceUpdate || !m_propSetMap[prop]) {
        if (propertyValue.IsNull()) {
          m_strokeLineCap = parent.StrokeLineCap();
        } else {
          auto strokeLineJoin{propertyValue.AsInt32()};
          switch (strokeLineJoin) {
            case 2:
              m_strokeLineJoin = Geometry::CanvasLineJoin::Bevel;
              break;
            case 1:
              m_strokeLineJoin = Geometry::CanvasLineJoin::Round;
              break;
            case 0:
            default:
              m_strokeLineJoin = Geometry::CanvasLineJoin::Miter;
              break;
          }
        }
      }
    } else if (propertyName == "fillRule") {
      prop = RNSVG::BaseProp::FillRule;
      if (forceUpdate || !m_propSetMap[prop]) {
        if (propertyValue.IsNull()) {
          m_fillRule = parent.FillRule();
        } else {
          auto fillRule{propertyValue.AsInt32()};
          switch (fillRule) {
            case 0:
              m_fillRule = Geometry::CanvasFilledRegionDetermination::Alternate;
              break;
            case 1:
            default:
              m_fillRule = Geometry::CanvasFilledRegionDetermination::Winding;
              break;
          }
        }
      }
    } else if (propertyName == "strokeDashoffset") {
      prop = RNSVG::BaseProp::StrokeDashOffset;
      if (forceUpdate || !m_propSetMap[prop]) {
        if (propertyValue.IsNull()) {
          m_strokeDashOffset = parent.StrokeDashOffset();
        } else {
          m_strokeDashOffset = propertyValue.AsSingle();
        }
      }
    } else if (propertyName == "strokeMiterlimit") {
      prop = RNSVG::BaseProp::StrokeMiterLimit;
      if (forceUpdate || !m_propSetMap[prop]) {
        if (propertyValue.IsNull()) {
          m_strokeMiterLimit = parent.StrokeMiterLimit();
        } else {
          m_strokeMiterLimit = propertyValue.AsSingle();
        }
      }
    } else if (propertyName == "strokeDasharray") {
      prop = RNSVG::BaseProp::StrokeDashArray;
      if (forceUpdate || !m_propSetMap[prop]) {
        if (propertyValue.IsNull()) {
          m_strokeDashArray = parent.StrokeDashArray();
        } else {
          auto const &asArray = propertyValue.AsArray();

          if (!asArray.empty() && (asArray.size() % 2 == 0)) {
            m_strokeDashArray.Clear();

            for (auto &item : asArray) {
              m_strokeDashArray.Append(SVGLength::From(item));
            }
          }
        }
      }
    } else if (propertyName == "matrix") {
      prop = RNSVG::BaseProp::Matrix;
      if (forceUpdate || !m_propSetMap[prop]) {
        if (propertyValue.IsNull()) {
          m_transformMatrix = parent.SvgTransform();
        } else {
          auto const &matrix{propertyValue.AsArray()};

          m_transformMatrix = float3x2(
              matrix.at(0).AsSingle(),
              matrix.at(1).AsSingle(),
              matrix.at(2).AsSingle(),
              matrix.at(3).AsSingle(),
              matrix.at(4).AsSingle(),
              matrix.at(5).AsSingle());
        }
      }
    }

    // forceUpdate = true means the property is being set on an element
    // instead of being inherited from the parent.
    if (forceUpdate && (prop != RNSVG::BaseProp::Unknown)) {
      // If the propertyValue is null, that means we reset the property
      m_propSetMap[prop] = !propertyValue.IsNull();
    }
  }

  m_recreateResources = true;

  if (invalidate) {
    InvalidateCanvas();
  }
}

void RenderableView::CreateGeometry(Microsoft::Graphics::Canvas::ICanvasResourceCreator const &/*resourceCreator*/) {}

void RenderableView::Render(
    Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &canvas,
    Microsoft::Graphics::Canvas::CanvasDrawingSession const &session)
{
  auto resourceCreator{canvas.try_as<ICanvasResourceCreator>()};
  if (m_recreateResources) {
    CreateGeometry(resourceCreator);
  }

  auto geometry{Geometry()};
  geometry = geometry.Transform(SvgTransform());
  geometry = Geometry::CanvasGeometry::CreateGroup(resourceCreator, {geometry}, FillRule());

  if (auto fillLayer{session.CreateLayer(FillOpacity())}) {
    session.FillGeometry(geometry, Fill());
    fillLayer.Close();
  }

  if (auto strokeLayer{session.CreateLayer(StrokeOpacity())}) {
    Geometry::CanvasStrokeStyle strokeStyle{};
    strokeStyle.EndCap(StrokeLineCap());
    strokeStyle.LineJoin(StrokeLineJoin());
    strokeStyle.DashOffset(StrokeDashOffset());
    strokeStyle.MiterLimit(StrokeMiterLimit());
    strokeStyle.CustomDashStyle(Utils::GetValueArray(StrokeDashArray()));

    session.DrawGeometry(geometry, Stroke(), StrokeWidth().Value(), strokeStyle);
    strokeLayer.Close();
  }
}

void RenderableView::InvalidateCanvas() {
  if (SvgParent()) {
    if (auto svgView{SvgParent().try_as<RNSVG::SvgView>()}) {
      svgView.InvalidateCanvas();
    } else if (auto renderable{SvgParent().try_as<RNSVG::RenderableView>()}) {
      renderable.InvalidateCanvas();
    }
  }
}
} // namespace winrt::RNSVG::implementation
