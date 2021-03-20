#include "pch.h"
#include "RenderableView.h"
#if __has_include("RenderableView.g.cpp")
#include "RenderableView.g.cpp"
#endif

#include "JSValueXaml.h"
#include "SVGLength.h"
#include "SvgView.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void RenderableView::UpdateProperties(IJSValueReader const &reader, bool invalidate) {
  const JSValueObject &propertyMap = JSValue::ReadObjectFrom(reader);
  auto const &parent = SvgParent().as<RNSVG::RenderableView>();

  for (auto const &pair : propertyMap) {
    auto const &propertyName = pair.first;
    auto const &propertyValue = pair.second;

    bool propSet{false};
    auto prop{RNSVG::BaseProp::Fill};

    if (propertyName == "strokeWidth") {
      prop = RNSVG::BaseProp::StrokeWidth;
      if (invalidate || !m_propSetMap[prop]) {
        if (Utils::JSValueIsNull(propertyValue)) {
          m_strokeWidth = parent.StrokeWidth();
        } else {
          m_strokeWidth = SVGLength::From(propertyValue);
        }
        propSet = true;
      }
    } else if (propertyName == "strokeOpacity") {
      prop = RNSVG::BaseProp::StrokeOpacity;
      if (invalidate || !m_propSetMap[prop]) {
        if (Utils::JSValueIsNull(propertyValue)) {
          m_strokeOpacity = parent.StrokeOpacity();
        } else {
          m_strokeOpacity = propertyValue.AsSingle();
        }
        propSet = true;
      }
    } else if (propertyName == "fillOpacity") {
      prop = RNSVG::BaseProp::FillOpacity;
      if (invalidate || !m_propSetMap[prop]) {
        if (Utils::JSValueIsNull(propertyValue)) {
          m_fillOpacity = parent.FillOpacity();
        } else {
          m_fillOpacity = propertyValue.AsSingle();
        }
      }
      propSet = true;
    } else if (propertyName == "stroke") {
      prop = RNSVG::BaseProp::Stroke;
      if (invalidate || !m_propSetMap[prop]) {
        Windows::UI::Color newColor{Windows::UI::Colors::Transparent()};
        if (Utils::JSValueIsNull(propertyValue)) {
          newColor = parent.Stroke();
        } else if (auto color = Utils::GetColorFromJSValue(propertyValue)) {
          newColor = color.value();
        }
        m_stroke = newColor;
        propSet = true;
      }
    } else if (propertyName == "fill") {
      prop = RNSVG::BaseProp::Fill;
      if (invalidate || !m_propSetMap[prop]) {
        Windows::UI::Color newColor{Windows::UI::Colors::Transparent()};
        if (Utils::JSValueIsNull(propertyValue)) {
          newColor = parent.Fill();
        } else if (auto color = Utils::GetColorFromJSValue(propertyValue)) {
          newColor = color.value();
        }
        m_fill = newColor;
        propSet = true;
      }
    } else if (propertyName == "strokeLinecap") {
      prop = RNSVG::BaseProp::StrokeLineCap;
      if (invalidate || !m_propSetMap[prop]) {
        if (Utils::JSValueIsNull(propertyValue)) {
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
      if (invalidate || !m_propSetMap[prop]) {
        if (Utils::JSValueIsNull(propertyValue)) {
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
        propSet = true;
      }
    } else if (propertyName == "fillRule") {
      prop = RNSVG::BaseProp::FillRule;
      if (invalidate || !m_propSetMap[prop]) {
        if (Utils::JSValueIsNull(propertyValue)) {
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
        propSet = true;
      }
    } else if (propertyName == "strokeDashoffset") {
      prop = RNSVG::BaseProp::StrokeDashOffset;
      if (invalidate || !m_propSetMap[prop]) {
        if (Utils::JSValueIsNull(propertyValue)) {
          m_strokeDashOffset = parent.StrokeDashOffset();
        } else {
          m_strokeDashOffset = propertyValue.AsSingle();
        }
        propSet = true;
      }
    } else if (propertyName == "strokeMiterlimit") {
      prop = RNSVG::BaseProp::StrokeMiterLimit;
      if (invalidate || !m_propSetMap[prop]) {
        if (Utils::JSValueIsNull(propertyValue)) {
          m_strokeMiterLimit = parent.StrokeMiterLimit();
        } else {
          m_strokeMiterLimit = propertyValue.AsSingle();
        }
        propSet = true;
      }
    } else if (propertyName == "strokeDasharray") {
      prop = RNSVG::BaseProp::StrokeDashArray;
      if (invalidate || !m_propSetMap[prop]) {
        if (Utils::JSValueIsNull(propertyValue)) {
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
        propSet = true;
      }
    }

    // Invalidate = true means a property is being changed on the element
    // and it not being inherited from parent.
    if (invalidate && propSet) {
      // If the propertyValue is null, that means we reset the property
      m_propSetMap[prop] = !Utils::JSValueIsNull(propertyValue);
    }
  }

  if (invalidate) {
    InvalidateCanvas();
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
