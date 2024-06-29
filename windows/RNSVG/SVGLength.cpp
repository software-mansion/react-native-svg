#pragma once

#include "pch.h"

#include "SVGLength.h"

#ifdef USE_FABRIC
#include <JSValueReader.h>
#else
#if __has_include("SVGLength.g.cpp")
#include "SVGLength.g.cpp"
#endif
#endif

#ifdef USE_FABRIC
namespace winrt::Microsoft::ReactNative {

void WriteValue(IJSValueWriter const &writer, const winrt::RNSVG::SVGLength &value) noexcept {
  switch (value.Unit) {
    case RNSVG::LengthType::Unknown:
      writer.WriteNull();
      return;
    case RNSVG::LengthType::EMS:
      writer.WriteString(winrt::to_hstring(std::to_string(value.Value) + "em"));
      return;
    case RNSVG::LengthType::EXS:
      writer.WriteString(winrt::to_hstring(std::to_string(value.Value) + "ex"));
      return;
    case RNSVG::LengthType::Centimeter:
      writer.WriteString(winrt::to_hstring(std::to_string(value.Value) + "cm"));
      return;
    case RNSVG::LengthType::Millimeter:
      writer.WriteString(winrt::to_hstring(std::to_string(value.Value) + "mm"));
      return;
    case RNSVG::LengthType::Inch:
      writer.WriteString(winrt::to_hstring(std::to_string(value.Value) + "in"));
      return;
    case RNSVG::LengthType::Point:
      writer.WriteString(winrt::to_hstring(std::to_string(value.Value) + "pt"));
      return;
    case RNSVG::LengthType::Pica:
      writer.WriteString(winrt::to_hstring(std::to_string(value.Value) + "pc"));
      return;
    case RNSVG::LengthType::Number:
      writer.WriteDouble(value.Value);
      return;
    default:
      assert(false);
  }
}

void ReadValue(IJSValueReader const &reader, /*out*/ winrt::RNSVG::SVGLength &value) noexcept {
  switch (reader.ValueType()) {
    case JSValueType::String: {
      auto str = to_string(reader.GetString());

      auto strLength{str.size()};
      if (strLength == 0 || str == "normal") {
        value.Unit = RNSVG::LengthType::Unknown;
        value.Value = 0.0;
        return;
      } else if (str.back() == '%') {
        value.Unit = RNSVG::LengthType::Percentage;
        value.Value = std::stof(str.substr(0, strLength - 1), nullptr);
        return;
      } else if (strLength > 2) {
        auto end{strLength - 2};
        auto lastTwo{str.substr(end)};

        value.Unit = RNSVG::LengthType::Unknown;
        if (lastTwo == "px") {
          value.Unit = RNSVG::LengthType::Number;
        } else if (lastTwo == "em") {
          value.Unit = RNSVG::LengthType::EMS;
        } else if (lastTwo == "ex") {
          value.Unit = RNSVG::LengthType::EXS;
        } else if (lastTwo == "cm") {
          value.Unit = RNSVG::LengthType::Centimeter;
        } else if (lastTwo == "mm") {
          value.Unit = RNSVG::LengthType::Millimeter;
        } else if (lastTwo == "in") {
          value.Unit = RNSVG::LengthType::Inch;
        } else if (lastTwo == "pt") {
          value.Unit = RNSVG::LengthType::Point;
        } else if (lastTwo == "pc") {
          value.Unit = RNSVG::LengthType::Pica;
        } else {
          value.Unit = RNSVG::LengthType::Number;
          end = strLength;
        }

        value.Value = std::stof(str.substr(0, end), nullptr);
        return;
      }

      value.Unit = RNSVG::LengthType::Number;
      value.Value = std::stof(str, nullptr);
    }
      return;
    case JSValueType::Int64:
      value.Unit = RNSVG::LengthType::Number;
      value.Value = static_cast<float>(reader.GetInt64());
      return;
    case JSValueType::Double:
      value.Unit = RNSVG::LengthType::Number;
      value.Value = static_cast<float>(reader.GetDouble());
      return;
    default:
      value.Unit = RNSVG::LengthType::Unknown;
      value.Value = 0.0f;
      return;
  }
}

} // namespace winrt::Microsoft::ReactNative
#else
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

#endif