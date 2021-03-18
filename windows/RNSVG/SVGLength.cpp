#include "pch.h"
#include "SVGLength.h"
#if __has_include("SVGLength.g.cpp")
#include "SVGLength.g.cpp"
#endif

namespace winrt::RNSVG::implementation
{
  SVGLength::SVGLength(double value)
    : m_value(value)
    , m_unit(RNSVG::UnitType::Number)
  {
  }

  SVGLength::SVGLength(double value, RNSVG::UnitType type)
    : m_value(value)
    , m_unit(type)
  {
  }

  RNSVG::SVGLength SVGLength::From(std::string value)
  {
    auto strLength{value.size()};
    if (strLength == 0 || value == "normal")
    {
      return {0.0, RNSVG::UnitType::Unknown};
    }
    else if (value.back() == '%')
    {
      return {std::stod(value.substr(0, strLength - 1), nullptr), RNSVG::UnitType::Percentage};
    }
    else if (strLength > 2)
    {
      auto end{strLength - 2};
      auto lastTwo{value.substr(end)};

      auto unit{RNSVG::UnitType::Unknown};
      if (lastTwo == "px")
      {
        unit = RNSVG::UnitType::Number;
      } else if (lastTwo == "em")
      {
        unit = RNSVG::UnitType::EMS;
      } else if (lastTwo == "ex")
      {
        unit = RNSVG::UnitType::EXS;
      } else if (lastTwo == "pt")
      {
        unit = RNSVG::UnitType::PT;
      } else if (lastTwo == "pc")
      {
        unit = RNSVG::UnitType::PC;
      } else if (lastTwo == "mm")
      {
        unit = RNSVG::UnitType::MM;
      } else if (lastTwo == "cm")
      {
        unit = RNSVG::UnitType::CM;
      } else
      {
        unit = RNSVG::UnitType::Number;
        end = strLength;
      }

      return {std::stod(value.substr(0, end), nullptr), unit};
    }

    return {std::stod(value, nullptr), RNSVG::UnitType::Number};
  }

  RNSVG::SVGLength SVGLength::From(Microsoft::ReactNative::JSValue const &propertyValue)
  {
    if (propertyValue.Type() == Microsoft::ReactNative::JSValueType::String)
    {
      return SVGLength::From(propertyValue.AsString());
    } else
    {
      return RNSVG::SVGLength(propertyValue.AsDouble());
    }
  }




} // namespace winrt::RNSVG::implementation
