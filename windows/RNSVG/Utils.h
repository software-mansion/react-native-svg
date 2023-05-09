#pragma once

#include "pch.h"

#include <winrt/Windows.Foundation.Numerics.h>
#include <winrt/Windows.UI.Text.h>
#include "JSValueReader.h"
#include "D2DHelpers.h"

#define _USE_MATH_DEFINES
#include <math.h>

namespace winrt::RNSVG {
struct Utils {
 public:
  static std::vector<float> GetAdjustedStrokeArray(IVector<SVGLength> const &value, float strokeWidth, float canvasDiagonal) {
    std::vector<float> result;

    for (auto const item : value) {
      float absValue{GetAbsoluteLength(item, canvasDiagonal)};

      // Win2D sets the length of each dash as the product of the element value in array and stroke width,
      // we divide each value in the dashArray by StrokeWidth to account for this.
      // http://microsoft.github.io/Win2D/WinUI2/html/P_Microsoft_Graphics_Canvas_Geometry_CanvasStrokeStyle_CustomDashStyle.htm
      result.push_back(absValue / (strokeWidth == 0.0f ? 1.0f : strokeWidth));
    }

    return result;
  }

  static float GetCanvasDiagonal(Size const &size) {
    float powX{std::powf(size.Width, 2)};
    float powY{std::powf(size.Height, 2)};

    return std::sqrtf(powX + powY) * static_cast<float>(M_SQRT1_2);
  }

  static float GetAbsoluteLength(SVGLength const& length, double relativeTo) {
    return GetAbsoluteLength(length, static_cast<float>(relativeTo));
  }

  static float GetAbsoluteLength(SVGLength const &length, float relativeTo) {
    auto value{length.Value()};

    // 1in = 2.54cm = 96px
    auto inch{96.0f};
    auto cm{inch / 2.54f};

    switch (length.Unit()) {
      case RNSVG::LengthType::Percentage:
        return value / 100.0f * relativeTo;
      case RNSVG::LengthType::Centimeter:
        // 1cm = 96px/2.54
        return value * cm;
      case RNSVG::LengthType::Millimeter:
        // 1mm = 1/10th of 1cm
        return value * cm / 10.0f;
      case RNSVG::LengthType::Inch:
        // 1in = 2.54cm = 96px
        return value * inch;
      case RNSVG::LengthType::Point:
        // 1pt = 1/72th of 1in
        return value * inch / 72.0f;
      case RNSVG::LengthType::Pica:
        // 1pc = 1/6th of 1in
        return value * inch / 6.0f;
      case RNSVG::LengthType::Pixel:
      default:
        return value;
    }
  }

  static Numerics::float3x2 GetRotationMatrix(float degrees) {
    // convert to radians
    auto radians{degrees * static_cast<float>(M_PI) / 100.0f};
    return Numerics::make_float3x2_rotation(radians);
  }

  static Numerics::float3x2 GetViewBoxTransform(Rect vbRect, Rect elRect, std::string align, RNSVG::MeetOrSlice meetOrSlice) {
    // based on https://svgwg.org/svg2-draft/coords.html#ComputingAViewportsTransform

    // Let vb-x, vb-y, vb-width, vb-height be the min-x, min-y, width and height values of the viewBox attribute
    // respectively.
    float vbX = vbRect.X;
    float vbY = vbRect.Y;
    float vbWidth = vbRect.Width;
    float vbHeight = vbRect.Height;

    // Let e-x, e-y, e-width, e-height be the position and size of the element respectively.
    float eX = elRect.X;
    float eY = elRect.Y;
    float eWidth = elRect.Width;
    float eHeight = elRect.Height;

    // Initialize scale-x to e-width/vb-width.
    float scaleX = eWidth / vbWidth;

    // Initialize scale-y to e-height/vb-height.
    float scaleY = eHeight / vbHeight;

    // If align is not 'none' and meetOrSlice is 'meet', set the larger of scale-x and scale-y to the smaller.
    // Otherwise, if align is not 'none' and meetOrSlice is 'slice', set the smaller of scale-x and scale-y to the
    // larger.
    if (align != "none" && meetOrSlice == RNSVG::MeetOrSlice::Meet) {
      scaleX = scaleY = std::min(scaleX, scaleY);
    } else if (align != "none" && meetOrSlice == RNSVG::MeetOrSlice::Slice) {
      scaleX = scaleY = std::max(scaleX, scaleY);
    }

    // Initialize translate-x to e-x - (vb-x * scale-x).
    float translateX = eX - (vbX * scaleX);

    // Initialize translate-y to e-y - (vb-y * scale-y).
    float translateY = eY - (vbY * scaleY);

    // If align contains 'xMid', add (e-width - vb-width * scale-x) / 2 to translate-x.
    if (align.find("xMid") != std::string::npos) {
      translateX += (eWidth - vbWidth * scaleX) / 2.0f;
    }

    // If align contains 'xMax', add (e-width - vb-width * scale-x) to translate-x.
    if (align.find("xMax") != std::string::npos) {
      translateX += (eWidth - vbWidth * scaleX);
    }

    // If align contains 'yMid', add (e-height - vb-height * scale-y) / 2 to translate-y.
    if (align.find("YMid") != std::string::npos) {
      translateY += (eHeight - vbHeight * scaleY) / 2.0f;
    }

    // If align contains 'yMax', add (e-height - vb-height * scale-y) to translate-y.
    if (align.find("YMax") != std::string::npos) {
      translateY += (eHeight - vbHeight * scaleY);
    }

    // The transform applied to content contained by the element is given by
    // translate(translate-x, translate-y) scale(scale-x, scale-y).
    auto const &translate{Numerics::make_float3x2_translation(translateX, translateY)};
    auto const &scale{Numerics::make_float3x2_scale(scaleX, scaleY)};

    return scale * translate;
  }

  static D2D1_MATRIX_3X2_F GetViewBoxTransformD2D(Rect vbRect, Rect elRect, std::string align, RNSVG::MeetOrSlice meetOrSlice) {
    return D2DHelpers::AsD2DTransform(GetViewBoxTransform(vbRect, elRect, align, meetOrSlice));
  }

  static RNSVG::MeetOrSlice GetMeetOrSlice(Microsoft::ReactNative::JSValue const &value) {
    if (value.IsNull()) {
      return RNSVG::MeetOrSlice::Meet;
    }

    switch (value.AsInt8()) {
      case 2:
        return RNSVG::MeetOrSlice::None;
      case 1:
        return RNSVG::MeetOrSlice::Slice;
      case 0:
      default:
        return RNSVG::MeetOrSlice::Meet;
    }
  }

  static std::string JSValueAsBrushUnits(
      Microsoft::ReactNative::JSValue const &value,
      std::string defaultValue = "objectBoundingBox") {
    if (value.IsNull()) {
      return defaultValue;
    } else {
      switch (value.AsInt32()) {
        case 1:
          return "userSpaceOnUse";
        case 0:
        default:
          return "objectBoundingBox";
      }
    }
  }

  static float JSValueAsFloat(Microsoft::ReactNative::JSValue const &value, float defaultValue = 0.0f) {
    if (value.IsNull()) {
      return defaultValue;
    } else {
      return value.AsSingle();
    }
  }

  static std::string JSValueAsString(
      Microsoft::ReactNative::JSValue const &value,
      std::string defaultValue = "") {
    if (value.IsNull()) {
      return defaultValue;
    } else {
      return value.AsString();
    }
  }

  static ui::Color JSValueAsColor(
      Microsoft::ReactNative::JSValue const &value,
      ui::Color defaultValue = Colors::Transparent()) {
    if (value.IsNull()) {
      return defaultValue;
    } else if (auto const &brush{value.To<xaml::Media::Brush>()}) {
      if (auto const &scb{brush.try_as<xaml::Media::SolidColorBrush>()}) {
        return scb.Color();
      }
    }

    return defaultValue;
  }

  static SVGLength JSValueAsSVGLength(
      Microsoft::ReactNative::JSValue const &value,
      SVGLength const &defaultValue = {}) {
    if (value.IsNull()) {
      return defaultValue;
    } else {
      return RNSVG::implementation::SVGLength::From(value);
    }
  }

  static Numerics::float3x2 JSValueAsTransform(
      Microsoft::ReactNative::JSValue const &value,
      Numerics::float3x2 defaultValue = {}) {
    if (value.IsNull()) {
      return defaultValue;
    } else {
      auto const &matrix{value.AsArray()};

      return Numerics::float3x2(
          matrix.at(0).AsSingle(),
          matrix.at(1).AsSingle(),
          matrix.at(2).AsSingle(),
          matrix.at(3).AsSingle(),
          matrix.at(4).AsSingle(),
          matrix.at(5).AsSingle());
    }
  }

  static D2D1_MATRIX_3X2_F JSValueAsD2DTransform(
    Microsoft::ReactNative::JSValue const& value,
    D2D1_MATRIX_3X2_F defaultValue = {}) {
    if (value.IsNull()) {
      return defaultValue;
    } else {
      auto const &matrix{value.AsArray()};

      return D2D1::Matrix3x2F(
          matrix.at(0).AsSingle(),
          matrix.at(1).AsSingle(),
          matrix.at(2).AsSingle(),
          matrix.at(3).AsSingle(),
          matrix.at(4).AsSingle(),
          matrix.at(5).AsSingle());
    }
  }

  static std::vector<D2D1_GRADIENT_STOP> JSValueAsStops(
      Microsoft::ReactNative::JSValue const &value) {
    if (value.IsNull()) {
      return {};
    }

    auto const &stops{value.AsArray()};
    std::vector<D2D1_GRADIENT_STOP> gradientStops(stops.size());

    for (size_t i = 0; i < stops.size(); ++i) {
      D2D1_GRADIENT_STOP stop{};
      stop.position = Utils::JSValueAsFloat(stops.at(i));
      stop.color = D2DHelpers::AsD2DColor(Utils::JSValueAsColor(stops.at(++i)));
      gradientStops[i] = stop;
    }

    return gradientStops;
  }

  static com_ptr<ID2D1Brush> GetCanvasBrush(
      hstring const &brushId,
      ui::Color color,
      RNSVG::SvgView const &root,
      com_ptr<ID2D1Geometry> const &geometry) {
    com_ptr<ID2D1Brush> brush;
    com_ptr<ID2D1DeviceContext1> deviceContext;
    copy_to_abi(root.DeviceContext(), *deviceContext.put_void());

    if (root && brushId != L"") {
      if (brushId == L"currentColor") {
        try {
          com_ptr<ID2D1SolidColorBrush> scb;
          deviceContext->CreateSolidColorBrush(D2DHelpers::AsD2DColor(root.CurrentColor()), scb.put());
          brush = scb.as<ID2D1Brush>();
        } catch (hresult_error const &e) {
          hresult hr = e.code();
        }
      } else if (auto const &brushView{root.Brushes().TryLookup(brushId)}) {
        try {
          brushView.CreateBrush();

          if (geometry) {
            D2D1_RECT_F bounds;
            geometry->GetBounds(nullptr, &bounds);
            brushView.SetBounds(D2DHelpers::FromD2DRect(bounds));
          }

          copy_to_abi(brushView.Brush(), *brush.put_void());
        } catch (hresult_error const &e) {
          hresult hr = e.code();
        }
      }
    }

    if (!brush) {
      try {
      com_ptr<ID2D1SolidColorBrush> scb;
      deviceContext->CreateSolidColorBrush(D2DHelpers::AsD2DColor(color), scb.put());
      brush = scb.as<ID2D1Brush>();
      } catch (hresult_error const &e) {
        hresult hr = e.code();
      }
    }

    return brush;
  }

  static Point GetScale(D2D1_MATRIX_3X2_F matrix) {
    auto scaleX = std::sqrt(matrix.m11 * matrix.m11 + matrix.m12 * matrix.m12);
    auto scaleY = std::sqrt(matrix.m21 * matrix.m21 + matrix.m22 * matrix.m22);

    return {scaleX, scaleY};
  }

  static Point GetScale(Numerics::float3x2 matrix) {
    return GetScale(D2DHelpers::AsD2DTransform(matrix));
  }
};
} // namespace winrt::RNSVG
