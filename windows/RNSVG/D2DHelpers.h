#pragma once

#include "pch.h"

#include "dwrite.h"

#include <Microsoft.Graphics.Canvas.h> //This defines the low-level ABI interfaces for the Win2D Windows Runtime Components
#include <Microsoft.Graphics.Canvas.native.h> //This is for interop

namespace abi {
using namespace ABI::Microsoft::Graphics::Canvas;
}

namespace win2d {
using namespace winrt::Microsoft::Graphics::Canvas;
}

namespace winrt::RNSVG {
struct D2DHelpers {
 public:
  static com_ptr<ID2D1DeviceContext1> GetDeviceContext(win2d::CanvasDrawingSession const &session) {
    com_ptr<abi::ICanvasResourceWrapperNative> nativeDeviceContextWrapper =
        session.as<abi::ICanvasResourceWrapperNative>();
    com_ptr<ID2D1DeviceContext1> deviceContext{nullptr};
    check_hresult(nativeDeviceContextWrapper->GetNativeResource(
        nullptr, 0.0f, guid_of<ID2D1DeviceContext1>(), deviceContext.put_void()));

    return deviceContext;
  }

  static com_ptr<ID2D1Factory> GetFactory(win2d::CanvasDrawingSession const &session) {
    com_ptr<ID2D1DeviceContext1> deviceContext{D2DHelpers::GetDeviceContext(session)};
    com_ptr<ID2D1Factory> factory;
    deviceContext->GetFactory(factory.put());

    return factory;
  }

   static com_ptr<ID2D1DeviceContext1> GetDeviceContext(win2d::UI::Xaml::CanvasControl const &canvas) {
    win2d::CanvasDevice canvasDevice = canvas.Device();

    // First we need to get an ID2D1Device1 pointer from the shared CanvasDevice
    com_ptr<abi::ICanvasResourceWrapperNative> nativeDeviceWrapper =
        canvasDevice.as<abi::ICanvasResourceWrapperNative>();
    com_ptr<ID2D1Device1> device{nullptr};
    check_hresult(nativeDeviceWrapper->GetNativeResource(nullptr, 0.0f, guid_of<ID2D1Device1>(), device.put_void()));

    // Next we need to call some Direct2D functions to create the object
    com_ptr<ID2D1DeviceContext1> context{nullptr};
    check_hresult(device->CreateDeviceContext(D2D1_DEVICE_CONTEXT_OPTIONS_NONE, context.put()));

    return context;
   }

   static com_ptr<ID2D1Factory> GetFactory(win2d::UI::Xaml::CanvasControl const &canvas) {
     com_ptr<ID2D1DeviceContext1> deviceContext{D2DHelpers::GetDeviceContext(canvas)};
     com_ptr<ID2D1Factory> factory;
     deviceContext->GetFactory(factory.put());

     return factory;
   }

   static win2d::Geometry::CanvasGeometry GetGeometry(ID2D1Geometry* geometryD2D) {
     if (geometryD2D) {
       auto canvasDevice{win2d::CanvasDevice::GetSharedDevice()};
       com_ptr<::IInspectable> asInspectable{nullptr};

       auto factory{get_activation_factory<win2d::CanvasDevice, abi::ICanvasFactoryNative>()};
       check_hresult(factory->GetOrCreate(
           canvasDevice.as<abi::ICanvasDevice>().get(),
           geometryD2D,
           0.0f,
           asInspectable.put()));

       return asInspectable.as<win2d::Geometry::CanvasGeometry>();
     }

     return nullptr;
   }

   static D2D1_CAP_STYLE GetLineCap(int32_t const lineCap) {
     switch (lineCap) {
       case 2:
         return D2D1_CAP_STYLE_SQUARE;
       case 1:
         return D2D1_CAP_STYLE_ROUND;
       case 0:
       default:
         return D2D1_CAP_STYLE_FLAT;
     }
   }

   static D2D1_LINE_JOIN GetLineJoin(int32_t const lineJoin) {
     switch (lineJoin) {
       case 2:
         return D2D1_LINE_JOIN_BEVEL;
       case 1:
         return D2D1_LINE_JOIN_ROUND;
       case 0:
       default:
         return D2D1_LINE_JOIN_MITER;
     }
   }

   static D2D1_FILL_MODE GetFillRule(int32_t const fillRule) {
     switch (fillRule) {
       case 0:
         return D2D1_FILL_MODE_ALTERNATE;
       case 1:
       default:
         return D2D1_FILL_MODE_WINDING;
     }
   }

   static D2D1::ColorF AsD2DColor(ui::Color const& color) {
     return {
         color.R / 255.0f,
         color.G / 255.0f,
         color.B / 255.0f,
         color.A / 255.0f};
   }

   static ui::Color FromD2DColor(D2D1::ColorF const color) {
     return ui::ColorHelper::FromArgb(
         static_cast<uint8_t>(color.a),
         static_cast<uint8_t>(color.r),
         static_cast<uint8_t>(color.g),
         static_cast<uint8_t>(color.b));
   }

   static Rect FromD2DRect(D2D1_RECT_F const rect) {
     return {rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top};
   }

   static D2D1_MATRIX_3X2_F AsD2DTransform(Numerics::float3x2 const transform) {
     return D2D1::Matrix3x2F(transform.m11, transform.m12, transform.m21, transform.m22, transform.m31, transform.m32);
   }

   static DWRITE_FONT_WEIGHT FontWeightFrom(hstring const &weight, xaml::FrameworkElement const &parent) {
     if (weight == L"normal") {
       return DWRITE_FONT_WEIGHT_NORMAL;
     } else if (weight == L"bold") {
       return DWRITE_FONT_WEIGHT_BOLD;
     } else if (weight == L"bolder" || weight == L"lighter" || weight == L"auto") {
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
