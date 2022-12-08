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
void RenderableView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};
  auto const &parent{SvgParent().try_as<RNSVG::RenderableView>()};

  auto const &propList{propertyMap.find("propList")};
  if (propList != propertyMap.end()) {
    m_propList.clear();
    auto const &propValue{(*propList).second};
    for (auto const &item : propValue.AsArray()) {
      m_propList.push_back(Utils::JSValueAsString(item));
    }
  }

  bool fillSet{std::find(m_propList.begin(), m_propList.end(), "fill") != m_propList.end()};
  bool strokeSet{std::find(m_propList.begin(), m_propList.end(), "stroke") != m_propList.end()};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    auto prop{RNSVG::BaseProp::Unknown};

    // name is not a prop we want to propagate to child elements
    // so we only set it when forceUpdate = true
    if (propertyName == "name" && forceUpdate) {
      if (parent) {
        SvgRoot().Templates().Remove(m_id);
      }
      m_id = to_hstring(Utils::JSValueAsString(propertyValue));
      if (parent) {
        SaveDefinition();
      }
    } else if (propertyName == "strokeWidth") {
      prop = RNSVG::BaseProp::StrokeWidth;
      if (forceUpdate || !m_propSetMap[prop]) {
        auto const &fallbackValue{parent ? parent.StrokeWidth() : RNSVG::SVGLength(1.0f, RNSVG::LengthType::Pixel)};
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
        Windows::UI::Color fallbackColor{(parent && !strokeSet) ? parent.Stroke() : Windows::UI::Colors::Transparent()};

        if (!m_strokeBrushId.empty()) {
          m_strokeBrushId.clear();
        }

        SetColor(propertyValue.AsObject(), fallbackColor, propertyName);
      }
    } else if (propertyName == "fill") {
      prop = RNSVG::BaseProp::Fill;
      if (forceUpdate || !m_propSetMap[prop]) {
        Windows::UI::Color fallbackColor{Windows::UI::Colors::Black()};
        if (propertyValue.IsNull() && fillSet) {
          fallbackColor = Windows::UI::Colors::Transparent();
        } else if (parent) {
          fallbackColor = parent.Fill();
        }

        if (!m_fillBrushId.empty()) {
          m_fillBrushId.clear();
        }

        SetColor(propertyValue.AsObject(), fallbackColor, propertyName);
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
      if (forceUpdate) {
        Numerics::float3x2 fallbackValue{parent ? parent.SvgTransform() : Numerics::make_float3x2_rotation(0)};
        m_transformMatrix = Utils::JSValueAsTransform(propertyValue, fallbackValue);
      }
    } else if (propertyName == "opacity" && forceUpdate) {
      m_opacity = Utils::JSValueAsFloat(propertyValue, 1.0f);
    } else if (propertyName == "clipPath") {
      m_clipPathId = to_hstring(Utils::JSValueAsString(propertyValue));
    }  else if (propertyName == "responsible") {
      m_isResponsible = propertyValue.AsBoolean();
    }

    // forceUpdate = true means the property is being set on an element
    // instead of being inherited from the parent.
    if (forceUpdate && (prop != RNSVG::BaseProp::Unknown)) {
      // If the propertyValue is null, that generally means the prop was deleted
      bool propSet{!propertyValue.IsNull()};

      // The exception being Fill and Stroke due to 'none' coming through as null
      if (prop == RNSVG::BaseProp::Fill) {
        propSet = fillSet;
      } else if (prop == RNSVG::BaseProp::Stroke) {
        propSet = strokeSet;
      }

      m_propSetMap[prop] = propSet;
    }
  }

  m_recreateResources = true;

  if (invalidate && SvgParent()) {
    SvgRoot().InvalidateCanvas();
  }
}

void RenderableView::SaveDefinition() {
  if (m_id != L"") {
    SvgRoot().Templates().Insert(m_id, *this);
  }
}

void RenderableView::Render(UI::Xaml::CanvasControl const &canvas, CanvasDrawingSession const &session) {
  auto const &resourceCreator{canvas.try_as<ICanvasResourceCreator>()};
  if (m_recreateResources) {
    CreateGeometry(canvas);
  }

  auto geometry{Geometry()};
  if (m_propSetMap[RNSVG::BaseProp::Matrix]) {
    geometry = geometry.Transform(SvgTransform());
  }

  auto const &clipPathGeometry{ClipPathGeometry()};

  geometry = Geometry::CanvasGeometry::CreateGroup(resourceCreator, {geometry}, FillRule());

  if (auto const &opacityLayer{clipPathGeometry ? session.CreateLayer(m_opacity, clipPathGeometry) : session.CreateLayer(m_opacity)}) {
    if (auto const &fillLayer{session.CreateLayer(FillOpacity())}) {
      auto const &fill{Utils::GetCanvasBrush(FillBrushId(), Fill(), SvgRoot(), geometry, resourceCreator)};
      session.FillGeometry(geometry, fill);
      fillLayer.Close();
    }

    if (auto const &strokeLayer{session.CreateLayer(StrokeOpacity())}) {
      Geometry::CanvasStrokeStyle strokeStyle{};
      strokeStyle.StartCap(StrokeLineCap());
      strokeStyle.EndCap(StrokeLineCap());
      strokeStyle.LineJoin(StrokeLineJoin());
      strokeStyle.DashOffset(StrokeDashOffset());
      strokeStyle.MiterLimit(StrokeMiterLimit());

      float canvasDiagonal{Utils::GetCanvasDiagonal(canvas.Size())};
      float strokeWidth{Utils::GetAbsoluteLength(StrokeWidth(), canvasDiagonal)};
      strokeStyle.CustomDashStyle(Utils::GetAdjustedStrokeArray(StrokeDashArray(), strokeWidth, canvasDiagonal));

      auto const &stroke{Utils::GetCanvasBrush(StrokeBrushId(), Stroke(), SvgRoot(), geometry, resourceCreator)};
      session.DrawGeometry(geometry, stroke, strokeWidth, strokeStyle);
      strokeLayer.Close();
    }

    opacityLayer.Close();
  }
}

void RenderableView::MergeProperties(RNSVG::RenderableView const &other) {
  for (auto const &prop : m_propSetMap) {
    if (!prop.second) {
      switch (prop.first) {
        case RNSVG::BaseProp::Fill:
          m_fill = other.Fill();
          m_fillBrushId = other.FillBrushId();
          break;
        case RNSVG::BaseProp::FillOpacity:
          m_fillOpacity = other.FillOpacity();
          break;
        case RNSVG::BaseProp::FillRule:
          m_fillRule = other.FillRule();
          break;
        case RNSVG::BaseProp::Stroke:
          m_stroke = other.Stroke();
          m_strokeBrushId = other.StrokeBrushId();
          break;
        case RNSVG::BaseProp::StrokeOpacity:
          m_strokeOpacity = other.StrokeOpacity();
          break;
        case RNSVG::BaseProp::StrokeWidth:
          m_strokeWidth = other.StrokeWidth();
          break;
        case RNSVG::BaseProp::StrokeMiterLimit:
          m_strokeMiterLimit = other.StrokeMiterLimit();
          break;
        case RNSVG::BaseProp::StrokeDashOffset:
          m_strokeDashOffset = other.StrokeDashOffset();
          break;
        case RNSVG::BaseProp::StrokeDashArray:
          m_strokeDashArray = other.StrokeDashArray();
          break;
        case RNSVG::BaseProp::StrokeLineCap:
          m_strokeLineCap = other.StrokeLineCap();
          break;
        case RNSVG::BaseProp::StrokeLineJoin:
          m_strokeLineJoin = other.StrokeLineJoin();
          break;
        case RNSVG::BaseProp::Unknown:
        default:
          break;
      }
    }
  }
}

RNSVG::SvgView RenderableView::SvgRoot() {
  if (SvgParent()) {
    if (auto const &svgView{SvgParent().try_as<RNSVG::SvgView>()}) {
      if (svgView.SvgParent()) {
        if (auto const &parent{svgView.SvgParent().try_as<RNSVG::RenderableView>()}) {
          return parent.SvgRoot();
        }
      } else {
        return svgView;
      }
    } else if (auto const &renderable{SvgParent().try_as<RNSVG::RenderableView>()}) {
      return renderable.SvgRoot();
    }
  }

  return nullptr;
}

Geometry::CanvasGeometry RenderableView::ClipPathGeometry() {
  if (!m_clipPathId.empty()) {
    if (auto const &clipPath{SvgRoot().Templates().TryLookup(m_clipPathId)}) {
      if (!clipPath.Geometry()) {
        clipPath.CreateGeometry(SvgRoot().Canvas());
      }
      return clipPath.Geometry();
    }
  }
  return nullptr;
}

void RenderableView::Unload() {
  if (m_geometry) {
    m_geometry.Close();
    m_geometry = nullptr;
  }

  m_parent = nullptr;
  m_reactContext = nullptr;
  m_propList.clear();
  m_propSetMap.clear();
  m_strokeDashArray.Clear();
}

RNSVG::IRenderable RenderableView::HitTest(Point const &point) {
  if (m_geometry) {
    bool strokeContainsPoint{false};
    if (auto const &svgRoot{SvgRoot()}) {
      float canvasDiagonal{Utils::GetCanvasDiagonal(svgRoot.Canvas().Size())};
      float strokeWidth{Utils::GetAbsoluteLength(StrokeWidth(), canvasDiagonal)};
      strokeContainsPoint = m_geometry.StrokeContainsPoint(point, strokeWidth);
    }
    if (m_geometry.FillContainsPoint(point) || strokeContainsPoint) {
      return *this;
    }
  }
  return nullptr;
}

void RenderableView::SetColor(const JSValueObject& propValue, Windows::UI::Color fallbackColor, std::string propName) {
  switch (propValue["type"].AsInt64()) {
    case 1: {
      auto const &brushId{to_hstring(Utils::JSValueAsString(propValue["brushRef"]))};
      propName == "fill" ? m_fillBrushId = brushId : m_strokeBrushId = brushId;
      break;
    }
    case 2: // currentColor
    case 3: // context-fill
    case 4: // context-stroke
      propName == "fill" ? m_fillBrushId = L"currentColor" : m_strokeBrushId = L"currentColor";
      break;
    default: {
      auto const &color {Utils::JSValueAsColor(propValue["payload"], fallbackColor)};
      propName == "fill" ? m_fill = color : m_stroke = color;
      break;
    }
  }
}
} // namespace winrt::RNSVG::implementation
