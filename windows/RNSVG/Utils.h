#pragma once

#include "pch.h"

#include <winrt/Windows.Foundation.Numerics.h>
#include "JSValueReader.h"


using namespace winrt;
using namespace Microsoft::ReactNative;
using namespace Windows::UI;

namespace winrt::RNSVG {
struct Utils {
 public:
  static std::optional<Color> GetColorFromJSValue(JSValue const &value) {
    if (auto brush = value.To<Xaml::Media::Brush>()) {
      if (auto scb = brush.try_as<Xaml::Media::SolidColorBrush>()) {
        return std::optional<Color>{scb.Color()};
      }
    }

    return std::nullopt;
  }

  static bool IsTransparent(Color const &color) {
    auto transparent{Colors::Transparent()};
    return color.A == transparent.A && color.R == transparent.R && color.G == transparent.G && color.B == transparent.B;
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
