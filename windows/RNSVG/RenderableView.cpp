#include "pch.h"
#include "RenderableView.h"
#if __has_include("RenderableView.g.cpp")
#include "RenderableView.g.cpp"
#endif

#include "Utils.h"
#include "SVGLength.h"
#include "JSValueXaml.h"
#include "SvgView.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation
{
    void RenderableView::UpdateProperties(IJSValueReader const &reader, bool invalidate)
    {
      const JSValueObject &propertyMap = JSValue::ReadObjectFrom(reader);

      for (auto const &pair : propertyMap)
      {
        auto const &propertyName = pair.first;
        auto const &propertyValue = pair.second;

        if (propertyName == "strokeWidth")
        {
          if (invalidate || m_strokeWidth.Unit() == RNSVG::UnitType::Unknown)
          {
            if (Utils::JSValueIsNull(propertyValue))
            {
              m_strokeWidth = SvgParent().as<RNSVG::RenderableView>().StrokeWidth();
            }
            else
            {
              m_strokeWidth = SVGLength::From(propertyValue);
            }
          }
        }
        else if (propertyName == "strokeOpacity")
        {
          if (Utils::JSValueIsNull(propertyValue))
          {
            m_strokeOpacity = SvgParent().as<RNSVG::RenderableView>().StrokeOpacity();
          }
          else
          {
            m_strokeOpacity = propertyValue.AsSingle();
          }
        }
        else if (propertyName == "fillOpacity")
        {
          if (Utils::JSValueIsNull(propertyValue))
          {
            m_fillOpacity = SvgParent().as<RNSVG::RenderableView>().FillOpacity();
          }
          else
          {
            m_fillOpacity = propertyValue.AsSingle();
          }
        }
        else if (propertyName == "stroke")
        {
          if (invalidate || Utils::IsTransparent(m_stroke))
          {
            Windows::UI::Color newColor{Windows::UI::Colors::Transparent()};
            if (Utils::JSValueIsNull(propertyValue))
            {
              newColor = SvgParent().as<RNSVG::RenderableView>().Stroke();
            }
            else if (auto color = Utils::GetColorFromJSValue(propertyValue))
            {
              newColor = color.value();
            }
            m_stroke = newColor;
          }
        }
        else if (propertyName == "fill")
        {
          if (invalidate || Utils::IsTransparent(m_fill))
          {
            Windows::UI::Color newColor{Windows::UI::Colors::Transparent()};
            if (Utils::JSValueIsNull(propertyValue))
            {
              newColor = SvgParent().as<RNSVG::RenderableView>().Fill();
            }
            else if (auto color = Utils::GetColorFromJSValue(propertyValue))
            {
              newColor = color.value();
            }
            m_fill = newColor;
          }
        }
        else if (propertyName == "strokeLinecap")
        {
          auto strokeLineCap{propertyValue.AsInt32()};
          switch (strokeLineCap)
          {
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
        else if (propertyName == "strokeLinejoin")
        {
          auto strokeLineJoin{propertyValue.AsInt32()};
          switch (strokeLineJoin)
          {
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
        else if (propertyName == "fillRule")
        {
          auto fillRule{propertyValue.AsInt32()};
          switch (fillRule)
          {
            case 0:
              m_fillRule = Geometry::CanvasFilledRegionDetermination::Alternate;
              break;
            case 1:
            default:
              m_fillRule = Geometry::CanvasFilledRegionDetermination::Winding;
              break;
          }
        } 
        else if (propertyName == "strokeDashoffset")
        {
          m_strokeDashOffset = propertyValue.AsSingle();
        }
        else if (propertyName == "strokeMiterlimit")
        {
          m_strokeMiterLimit = propertyValue.AsSingle();
        }
        else if (propertyName == "strokeDasharray")
        {
          auto const& asArray = propertyValue.AsArray();

          if (!asArray.empty() && (asArray.size() % 2 == 0))
          {
            m_strokeDashArray.Clear();
          
            for (auto& item : asArray)
            {
              m_strokeDashArray.Append(SVGLength::From(item));
            }
          }
        }
      }

      if (invalidate)
      {
        InvalidateCanvas();
      }
    }

    void RenderableView::InvalidateCanvas()
    {
      if (SvgParent())
      {
        if (auto svgView{SvgParent().try_as<RNSVG::SvgView>()})
        {
          svgView.InvalidateCanvas();
        }
        else if (auto renderable{SvgParent().try_as<RNSVG::RenderableView>()})
        {
          renderable.InvalidateCanvas();
        }
      }
    }
}
