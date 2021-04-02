#include "pch.h"
#include "RenderableView.h"
#if __has_include("RenderableView.g.cpp")
#include "RenderableView.g.cpp"
#endif

#include "JSValueXaml.h"
#include "SvgView.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void RenderableView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate){
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};
  auto const &parent{SvgParent().try_as<RNSVG::RenderableView>()};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    auto prop{RNSVG::BaseProp::Unknown};

    // name is not a prop we want to propagate to child elements
    // so we only set it when forceUpdate = true
    if (propertyName == "name" && forceUpdate) {
      m_id = to_hstring(Utils::JSValueAsString(propertyValue));
    } else if (propertyName == "strokeWidth") {
      prop = RNSVG::BaseProp::StrokeWidth;
      if (forceUpdate || !m_propSetMap[prop]) {
        auto const &fallbackValue{parent ? parent.StrokeWidth() : RNSVG::SVGLength()};
        m_strokeWidth = Utils::JSValueAsSVGLength(propertyValue, fallbackValue);
      }
    } else if (propertyName == "strokeOpacity") {
      prop = RNSVG::BaseProp::StrokeOpacity;
      if (forceUpdate || !m_propSetMap[prop]) {
        float fallbackValue{parent ? parent.StrokeOpacity() : 1.0f};
        m_strokeOpacity = Utils::JSValueAsFloat(propertyValue, fallbackValue);
      }
    } else if (propertyName == "fillOpacity") {
      prop = RNSVG::BaseProp::FillOpacity;
      if (forceUpdate || !m_propSetMap[prop]) {
        float fallbackValue{parent ? parent.FillOpacity() : 1.0f};
        m_fillOpacity = Utils::JSValueAsFloat(propertyValue, fallbackValue);
      }
    } else if (propertyName == "stroke") {
      prop = RNSVG::BaseProp::Stroke;
      if (forceUpdate || !m_propSetMap[prop]) {
        Windows::UI::Color fallbackColor{parent ? parent.Stroke() : Windows::UI::Colors::Transparent()};
        m_stroke = Utils::JSValueAsColor(propertyValue, fallbackColor);
      }
    } else if (propertyName == "fill") {
      prop = RNSVG::BaseProp::Fill;
      if (forceUpdate || !m_propSetMap[prop]) {
        Windows::UI::Color fallbackColor{parent ? parent.Fill() : Windows::UI::Colors::Transparent()};
        m_fill = Utils::JSValueAsColor(propertyValue, fallbackColor);
      }
    } else if (propertyName == "strokeLinecap") {
      prop = RNSVG::BaseProp::StrokeLineCap;
      if (forceUpdate || !m_propSetMap[prop]) {
        if (propertyValue.IsNull()) {
          m_strokeLineCap = parent.StrokeLineCap();
        } else {
          auto const &strokeLineCap{propertyValue.AsInt32()};
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
          auto const &strokeLineJoin{propertyValue.AsInt32()};
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
          auto const &fillRule{propertyValue.AsInt32()};
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
        float fallbackValue{parent ? parent.StrokeDashOffset() : 0.0f};
        m_strokeDashOffset = Utils::JSValueAsFloat(propertyValue, fallbackValue);
      }
    } else if (propertyName == "strokeMiterlimit") {
      prop = RNSVG::BaseProp::StrokeMiterLimit;
      if (forceUpdate || !m_propSetMap[prop]) {
        float fallbackValue{parent ? parent.StrokeMiterLimit() : 0.0f};
        m_strokeMiterLimit = Utils::JSValueAsFloat(propertyValue, fallbackValue);
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

            for (auto const &item : asArray) {
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

          m_transformMatrix = Numerics::float3x2(
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

  if (invalidate && SvgParent()) {
    SvgRoot().InvalidateCanvas();
  }
}

void RenderableView::Render(
    UI::Xaml::CanvasControl const &canvas,
    CanvasDrawingSession const &session)
{
  auto resourceCreator{canvas.try_as<ICanvasResourceCreator>()};
  if (m_recreateResources) {
    CreateGeometry(canvas);
  }

  auto geometry{Geometry()};
  geometry = geometry.Transform(SvgTransform());
  geometry = Geometry::CanvasGeometry::CreateGroup(resourceCreator, {geometry}, FillRule());

  if (auto const &fillLayer{session.CreateLayer(FillOpacity())}) {
    session.FillGeometry(geometry, Fill());
    fillLayer.Close();
  }

  if (auto const &strokeLayer{session.CreateLayer(StrokeOpacity())}) {
    Geometry::CanvasStrokeStyle strokeStyle{};
    strokeStyle.StartCap(StrokeLineCap());
    strokeStyle.EndCap(StrokeLineCap());
    strokeStyle.LineJoin(StrokeLineJoin());
    strokeStyle.DashOffset(StrokeDashOffset());
    strokeStyle.MiterLimit(StrokeMiterLimit());
    strokeStyle.CustomDashStyle(Utils::GetValueArray(StrokeDashArray()));

    session.DrawGeometry(geometry, Stroke(), StrokeWidth().Value(), strokeStyle);
    strokeLayer.Close();
  }
}

RNSVG::SvgView RenderableView::SvgRoot() {
  if (SvgParent()) {
    if (auto const &svgView{SvgParent().try_as<RNSVG::SvgView>()}) {
      return svgView;
    } else if (auto const &renderable{SvgParent().try_as<RNSVG::RenderableView>()}) {
      return renderable.SvgRoot();
    }
  }

  return {nullptr};
}
} // namespace winrt::RNSVG::implementation
