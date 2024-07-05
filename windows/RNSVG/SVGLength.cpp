#include "pch.h"
#include "SVGLength.h"
#if __has_include("SVGLength.g.cpp")
#include "SVGLength.g.cpp"
#endif

namespace winrt::RNSVG::implementation {
SVGLength::SVGLength(float value) : m_value(value), m_unit(RNSVG::LengthType::Number) {}

SVGLength::SVGLength(float value, RNSVG::LengthType const &type) : m_value(value), m_unit(type) {}

RNSVG::SVGLength SVGLength::From(std::string value) {
  auto strLength{value.size()};
  if (strLength == 0 || value == "normal") {
    return {0.0, RNSVG::LengthType::Unknown};
  } else if (value.back() == '%') {
    return {std::stof(value.substr(0, strLength - 1), nullptr), RNSVG::LengthType::Percentage};
  } else if (strLength > 2) {
    auto end{strLength - 2};
    auto lastTwo{value.substr(end)};

    auto unit{RNSVG::LengthType::Unknown};
    if (lastTwo == "px") {
      unit = RNSVG::LengthType::Number;
    } else if (lastTwo == "em") {
      unit = RNSVG::LengthType::EMS;
    } else if (lastTwo == "ex") {
      unit = RNSVG::LengthType::EXS;
    } else if (lastTwo == "cm") {
      unit = RNSVG::LengthType::Centimeter;
    } else if (lastTwo == "mm") {
      unit = RNSVG::LengthType::Millimeter;
    } else if (lastTwo == "in") {
      unit = RNSVG::LengthType::Inch;
    } else if (lastTwo == "pt") {
      unit = RNSVG::LengthType::Point;
    } else if (lastTwo == "pc") {
      unit = RNSVG::LengthType::Pica;
    } else {
      unit = RNSVG::LengthType::Number;
      end = strLength;
    }

    return {std::stof(value.substr(0, end), nullptr), unit};
  }

  return {std::stof(value, nullptr), RNSVG::LengthType::Number};
}

RNSVG::SVGLength SVGLength::From(Microsoft::ReactNative::JSValue const &propertyValue) {
  if (propertyValue.IsNull()) {
    return {0.0f, RNSVG::LengthType::Unknown};
  } else if (propertyValue.Type() == Microsoft::ReactNative::JSValueType::String) {
    return SVGLength::From(propertyValue.AsString());
  } else {
    return RNSVG::SVGLength(propertyValue.AsSingle());
  }
}
} // namespace winrt::RNSVG::implementation
