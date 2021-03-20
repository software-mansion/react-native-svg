#include "pch.h"
#include "RenderableView.h"
#if __has_include("RenderableView.g.cpp")
#include "RenderableView.g.cpp"
#endif

#include "Utils.h"
#include "SVGLength.h"
#include "JSValueXaml.h"
#include "SvgView.h"

namespace winrt::RNSVG::implementation
{
    void RenderableView::UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool invalidate)
    {
      const Microsoft::ReactNative::JSValueObject &propertyMap =
          Microsoft::ReactNative::JSValue::ReadObjectFrom(reader);

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
            } else
            {
              m_strokeWidth = SVGLength::From(propertyValue);
            }
          }
        } else if (propertyName == "stroke")
        {
          if (invalidate || Utils::IsTransparent(m_stroke))
          {
            Windows::UI::Color newColor{Windows::UI::Colors::Transparent()};
            if (Utils::JSValueIsNull(propertyValue))
            {
              newColor = SvgParent().as<RNSVG::RenderableView>().Stroke();
            } else
            {
              if (auto color = Utils::GetColorFromJSValue(propertyValue))
              {
                newColor = color.value();
              }
            }
            m_stroke = newColor;
          }
        } else if (propertyName == "fill")
        {
          if (invalidate || Utils::IsTransparent(m_fill))
          {
            Windows::UI::Color newColor{Windows::UI::Colors::Transparent()};
            if (Utils::JSValueIsNull(propertyValue))
            {
              newColor = SvgParent().as<RNSVG::RenderableView>().Fill();
            } else
            {
              if (auto color = Utils::GetColorFromJSValue(propertyValue))
              {
                newColor = color.value();
              }
            }
            m_fill = newColor;
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
        } else if (auto renderable{SvgParent().try_as<RNSVG::RenderableView>()})
        {
          renderable.InvalidateCanvas();
        }
      }
    }
}
