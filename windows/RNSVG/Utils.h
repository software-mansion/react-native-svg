#pragma once

#include "pch.h"

#include <winrt/Windows.Foundation.Numerics.h>
#include <winrt/Windows.UI.Text.h>
#include "JSValueReader.h"

using namespace winrt;
using namespace Microsoft::ReactNative;
using namespace Windows::UI;
using namespace Windows::UI::Text;

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

  static FontWeight FontWeightFrom(hstring const& weight, Xaml::FrameworkElement const& parent) {
    if (weight == L"normal") {
      return FontWeights::Normal();
    } else if (weight == L"bold") {
      return FontWeights::Bold();
    } else if (weight == L"bolder" || weight == L"lighter" || weight == L"auto") {
      auto groupView{parent.try_as<RNSVG::GroupView>()};
      FontWeight parentWeight{
          groupView ? FontWeightFrom(groupView.FontWeight(), groupView.SvgParent()) : FontWeights::Normal()};

      if (weight == L"bolder") {
        return Bolder(parentWeight.Weight);
      } else if (weight == L"lighter") {
        return Lighter(parentWeight.Weight);
      } else if (weight == L"auto") {
        return parentWeight;
      }
    }

    return GetClosestFontWeight(std::stof(weight.c_str(), nullptr));
  }

  static FontWeight GetClosestFontWeight(float weight) {
    if (weight > 325 && weight < 375) {
      return FontWeights::SemiLight();
    } else if (weight > 925) {
      return FontWeights::ExtraBlack();
    } else {
      switch (static_cast<uint16_t>(std::round(weight / 100.0f))) {
        case 1:
          return FontWeights::Thin();
        case 2:
          return FontWeights::ExtraLight();
        case 3:
          return FontWeights::Light();
        case 4:
          return FontWeights::Normal();
        case 5:
          return FontWeights::Medium();
        case 6:
          return FontWeights::SemiBold();
        case 7:
          return FontWeights::Bold();
        case 8:
          return FontWeights::ExtraBold();
        case 9:
        default:
          return FontWeights::ExtraBlack();
      }
    }
  }

  static FontWeight Bolder(uint16_t weight) {
    if (weight < 350) {
      return FontWeights::Normal();
    } else if (weight < 550) {
      return FontWeights::Bold();
    } else if (weight < 900) {
      return FontWeights::Black();
    } else {
      return FontWeights::ExtraBlack();
    }
  }

  static FontWeight Lighter(uint16_t weight) {
    if (weight < 550) {
      return FontWeights::Thin();
    } else if (weight < 750) {
      return FontWeights::Normal();
    } else {
      return FontWeights::Bold();
    }
  }
};
} // namespace winrt::RNSVG
