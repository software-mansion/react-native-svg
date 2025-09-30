#pragma once

namespace winrt::RNSVG {
struct D2DHelpers {
 public:
  static D2D1::ColorF AsD2DColor(winrt::Windows::UI::Color const &color) {
    return {
        color.R / 255.0f,
        color.G / 255.0f,
        color.B / 255.0f,
        color.A / 255.0f};
  }

  static D2D1::Matrix3x2F AsD2DTransform(winrt::Windows::Foundation::Numerics::float3x2 const &transform) {
    return D2D1::Matrix3x2F(transform.m11, transform.m12, transform.m21, transform.m22, transform.m31, transform.m32);
  }
};
} // namespace winrt::RNSVG
