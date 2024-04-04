#pragma once

#include "pch.h"

#include "dwrite.h"

namespace winrt::RNSVG {
struct D2DHelpers {
 public:

   static void PushOpacityLayer(
      ID2D1DeviceContext *deviceContext,
      ID2D1Geometry *clipPathGeometry,
      float opacity) {
    com_ptr<ID2D1Layer> opacityLayer;
    check_hresult(deviceContext->CreateLayer(nullptr, opacityLayer.put()));

    D2D1_LAYER_PARAMETERS layerParams{D2D1::LayerParameters()};
    layerParams.opacity = opacity;

    if (clipPathGeometry) {
      layerParams.geometricMask = clipPathGeometry;
    }

    deviceContext->PushLayer(layerParams, opacityLayer.get());
  }

   static void PushOpacityLayer(
      ID2D1DeviceContext *deviceContext,
      ID2D1Geometry *clipPathGeometry,
      float opacity,
      D2D1_MATRIX_3X2_F transform) {
    com_ptr<ID2D1Layer> opacityLayer;
    check_hresult(deviceContext->CreateLayer(nullptr, opacityLayer.put()));

    D2D1_LAYER_PARAMETERS layerParams{D2D1::LayerParameters()};
    layerParams.opacity = opacity;
    layerParams.maskTransform = transform;

    if (clipPathGeometry) {
      layerParams.geometricMask = clipPathGeometry;
    }

    deviceContext->PushLayer(layerParams, opacityLayer.get());
   }

   static D2D1_CAP_STYLE GetLineCap(RNSVG::LineCap const &lineCap) {
     switch (lineCap) {
       case RNSVG::LineCap::Square:
         return D2D1_CAP_STYLE_SQUARE;
       case RNSVG::LineCap::Round:
         return D2D1_CAP_STYLE_ROUND;
       case RNSVG::LineCap::Butt:
       default:
         return D2D1_CAP_STYLE_FLAT;
     }
   }

   static D2D1_LINE_JOIN GetLineJoin(RNSVG::LineJoin const &lineJoin) {
     switch (lineJoin) {
       case RNSVG::LineJoin::Bevel:
         return D2D1_LINE_JOIN_BEVEL;
       case RNSVG::LineJoin::Round:
         return D2D1_LINE_JOIN_ROUND;
       case RNSVG::LineJoin::Miter:
       default:
         return D2D1_LINE_JOIN_MITER;
     }
   }

   static D2D1_FILL_MODE GetFillRule(RNSVG::FillRule const &fillRule) {
     switch (fillRule) {
       case RNSVG::FillRule::EvenOdd:
         return D2D1_FILL_MODE_ALTERNATE;
       case RNSVG::FillRule::NonZero:
       default:
         return D2D1_FILL_MODE_WINDING;
     }
   }

   static D2D1::ColorF AsD2DColor(Windows::UI::Color const &color) {
     return {
         color.R / 255.0f,
         color.G / 255.0f,
         color.B / 255.0f,
         color.A / 255.0f};
   }

   static Windows::UI::Color FromD2DColor(D2D1::ColorF const color) {
     return Windows::UI::Color{
         static_cast<uint8_t>(color.a),
         static_cast<uint8_t>(color.r),
         static_cast<uint8_t>(color.g),
         static_cast<uint8_t>(color.b),
     };
   }

   static D2D1_RECT_F AsD2DRect(Rect const &rect) {
     return {rect.X, rect.Y, rect.Width + rect.X, rect.Height + rect.Y};
   }

   static Rect FromD2DRect(D2D1_RECT_F const rect) {
     return {rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top};
   }

   static Size SizeFromD2DRect(D2D1_RECT_F const rect) {
     return {rect.right - rect.left, rect.bottom - rect.top};
   }

   static float WidthFromD2DRect(D2D1_RECT_F const rect) {
     return rect.right - rect.left;
   }

   static float HeightFromD2DRect(D2D1_RECT_F const rect) {
     return rect.bottom - rect.top;
   }

   static Numerics::float3x2 FromD2DTransform(D2D1_MATRIX_3X2_F const transform) {
     return Numerics::float3x2(
         transform.m11, transform.m12, transform.m21, transform.m22, transform._31, transform._32);
   }

   static D2D1::Matrix3x2F AsD2DTransform(Numerics::float3x2 const &transform) {
     return D2D1::Matrix3x2F(transform.m11, transform.m12, transform.m21, transform.m22, transform.m31, transform.m32);
   }

   static D2D1_MATRIX_3X2_F GetTransform(ID2D1DeviceContext* deviceContext) {
     D2D1_MATRIX_3X2_F transform;
     deviceContext->GetTransform(&transform);

     return transform;
   }

   static DWRITE_FONT_WEIGHT FontWeightFrom(hstring const &weight, xaml::FrameworkElement const &parent) {
     if (weight == L"normal") {
       return DWRITE_FONT_WEIGHT_NORMAL;
     } else if (weight == L"bold") {
       return DWRITE_FONT_WEIGHT_BOLD;
     }

     auto const &groupView{parent.try_as<RNSVG::GroupView>()};
     DWRITE_FONT_WEIGHT parentWeight{
     groupView ? D2DHelpers::FontWeightFrom(groupView.FontWeight(), groupView.SvgParent()) : DWRITE_FONT_WEIGHT_NORMAL};

     if (weight == L"bolder") {
       return D2DHelpers::Bolder(parentWeight);
     } else if (weight == L"lighter") {
       return D2DHelpers::Lighter(parentWeight);
     } else if (weight == L"auto") {
       return parentWeight;
     }

     return D2DHelpers::GetClosestFontWeight(std::stof(weight.c_str(), nullptr));
   }

   // https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#meaning_of_relative_weights
   static DWRITE_FONT_WEIGHT Bolder(DWRITE_FONT_WEIGHT weight) {
     switch (weight) {
       case DWRITE_FONT_WEIGHT_THIN:
       case DWRITE_FONT_WEIGHT_EXTRA_LIGHT:
       case DWRITE_FONT_WEIGHT_LIGHT:
       case DWRITE_FONT_WEIGHT_SEMI_LIGHT:
         return DWRITE_FONT_WEIGHT_NORMAL;
       case DWRITE_FONT_WEIGHT_NORMAL:
       case DWRITE_FONT_WEIGHT_MEDIUM:
       case DWRITE_FONT_WEIGHT_SEMI_BOLD:
         return DWRITE_FONT_WEIGHT_BOLD;
       case DWRITE_FONT_WEIGHT_BOLD:
       case DWRITE_FONT_WEIGHT_EXTRA_BOLD:
         return DWRITE_FONT_WEIGHT_BLACK;
       case DWRITE_FONT_WEIGHT_BLACK:
       default:
         return DWRITE_FONT_WEIGHT_EXTRA_BLACK;
     }
   }

   static DWRITE_FONT_WEIGHT Lighter(DWRITE_FONT_WEIGHT weight) {
     switch (weight) {
       case DWRITE_FONT_WEIGHT_THIN:
       case DWRITE_FONT_WEIGHT_EXTRA_LIGHT:
       case DWRITE_FONT_WEIGHT_LIGHT:
       case DWRITE_FONT_WEIGHT_SEMI_LIGHT:
       case DWRITE_FONT_WEIGHT_NORMAL:
       case DWRITE_FONT_WEIGHT_MEDIUM:
         return DWRITE_FONT_WEIGHT_THIN;
       case DWRITE_FONT_WEIGHT_SEMI_BOLD:
       case DWRITE_FONT_WEIGHT_BOLD:
         return DWRITE_FONT_WEIGHT_NORMAL;
       case DWRITE_FONT_WEIGHT_EXTRA_BOLD:
       case DWRITE_FONT_WEIGHT_BLACK:
       default:
         return DWRITE_FONT_WEIGHT_BOLD;
     }
   }

   static DWRITE_FONT_WEIGHT GetClosestFontWeight(float weight) {
     if (weight > 325 && weight < 375) {
       return DWRITE_FONT_WEIGHT_SEMI_LIGHT;
     } else if (weight > 925) {
       return DWRITE_FONT_WEIGHT_EXTRA_BLACK;
     } else {
       switch (static_cast<uint16_t>(std::round(weight / 100.0f))) {
         case 1:
           return DWRITE_FONT_WEIGHT_THIN;
         case 2:
           return DWRITE_FONT_WEIGHT_EXTRA_LIGHT;
         case 3:
           return DWRITE_FONT_WEIGHT_LIGHT;
         case 4:
           return DWRITE_FONT_WEIGHT_NORMAL;
         case 5:
           return DWRITE_FONT_WEIGHT_MEDIUM;
         case 6:
           return DWRITE_FONT_WEIGHT_SEMI_BOLD;
         case 7:
           return DWRITE_FONT_WEIGHT_BOLD;
         case 8:
           return DWRITE_FONT_WEIGHT_EXTRA_BOLD;
         case 9:
         default:
           return DWRITE_FONT_WEIGHT_BLACK;
       }
     }
   }
};
} // namespace winrt::RNSVG
