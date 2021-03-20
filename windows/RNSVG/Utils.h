#pragma once

#include "pch.h"

#include "JSValueReader.h"

using namespace winrt;

namespace winrt::RNSVG {
struct Utils {
 public:
  static std::optional<Windows::UI::Color> GetColorFromJSValue(Microsoft::ReactNative::JSValue const &value) {
    if (auto brush = value.To<Windows::UI::Xaml::Media::Brush>()) {
      if (auto scb = brush.try_as<Windows::UI::Xaml::Media::SolidColorBrush>()) {
        return std::optional<Windows::UI::Color>{scb.Color()};
      }
    }

    return std::nullopt;
  }

  static bool IsTransparent(Windows::UI::Color const &color) {
    auto transparent{Windows::UI::Colors::Transparent()};
    return color.A == transparent.A && color.R == transparent.R && color.G == transparent.G && color.B == transparent.B;
  }

  static bool JSValueIsNull(Microsoft::ReactNative::JSValue const &value) {
    return value.Type() == Microsoft::ReactNative::JSValueType::Null;
  }

  static std::vector<float> GetValueArray(IVector<SVGLength> const &value) {
    std::vector<float> result;

    for (auto item : value) {
      result.push_back(item.Value());
    }

    return std::move(result);
  }
};
} // namespace winrt::RNSVG
