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
    void RenderableView::UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader)
    {
      const Microsoft::ReactNative::JSValueObject &propertyMap =
          Microsoft::ReactNative::JSValue::ReadObjectFrom(reader);

      for (auto const &pair : propertyMap)
      {
        auto const &propertyName = pair.first;
        auto const &propertyValue = pair.second;

        if (propertyName == "strokeWidth")
        {
          m_strokeWidth = SVGLength::From(propertyValue);
        } else if (propertyName == "stroke")
        {
          if (auto color = Utils::GetColorFromJSValue(propertyValue))
          {
            m_stroke = color.value();
          }
        } else if (propertyName == "fill")
        {
          if (auto color = Utils::GetColorFromJSValue(propertyValue))
          {
            m_fill = color.value();
          }
        }
      }

      InvalidateCanvas();
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
