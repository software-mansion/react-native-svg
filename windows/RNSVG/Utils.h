#pragma once

#include "pch.h"

#include "JSValueReader.h"

using namespace winrt;

namespace winrt::RNSVG
{
  struct Utils
  {
   public:
    static std::optional<Windows::UI::Color> GetColorFromJSValue(Microsoft::ReactNative::JSValue const& value)
    {
      if (auto brush = value.To<Windows::UI::Xaml::Media::Brush>())
      {
        if (auto scb = brush.try_as<Windows::UI::Xaml::Media::SolidColorBrush>())
        {
          return std::optional<Windows::UI::Color>{scb.Color()};
        }
      }

      return std::nullopt;
    }
  };
}
