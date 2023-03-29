#pragma once

#include "pch.h"

#include <Microsoft.Graphics.Canvas.h> //This defines the low-level ABI interfaces for the Win2D Windows Runtime Components
#include <Microsoft.Graphics.Canvas.native.h> //This is for interop

namespace winrt::RNSVG {
struct D2DHelpers {
 public:
   static winrt::com_ptr<ID2D1DeviceContext1> GetDeviceContext(winrt::Microsoft::Graphics::Canvas::CanvasDrawingSession const& session) {
    winrt::com_ptr<ABI::Microsoft::Graphics::Canvas::ICanvasResourceWrapperNative> nativeDeviceContextWrapper =
         session.as<ABI::Microsoft::Graphics::Canvas::ICanvasResourceWrapperNative>();
    winrt::com_ptr<ID2D1DeviceContext1> deviceContext{nullptr};
    winrt::check_hresult(nativeDeviceContextWrapper->GetNativeResource(
        nullptr, 0.0f, guid_of<ID2D1DeviceContext1>(), deviceContext.put_void()));

    return deviceContext;
   }

   static winrt::Microsoft::Graphics::Canvas::Geometry::CanvasStrokeStyle GetStrokeStyle(
     winrt::com_ptr<ID2D1StrokeStyle> strokeStyleD2D) {
     auto canvasDevice{winrt::Microsoft::Graphics::Canvas::CanvasDevice::GetSharedDevice()};
     winrt::com_ptr<::IInspectable> pInspectable{nullptr};
     auto factory{winrt::get_activation_factory<
         winrt::Microsoft::Graphics::Canvas::CanvasDevice,
         ABI::Microsoft::Graphics::Canvas::ICanvasFactoryNative>()};
     winrt::check_hresult(
         factory->GetOrCreate(canvasDevice.as<ABI::Microsoft::Graphics::Canvas::ICanvasDevice>().get(), strokeStyleD2D.as<::IUnknown>().get(), 0.0f, pInspectable.put()));

     return pInspectable.as<winrt::Microsoft::Graphics::Canvas::Geometry::CanvasStrokeStyle>();
   }

   static D2D1_CAP_STYLE GetLineCap(int32_t lineCap) {
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

   static D2D1_LINE_JOIN GetLineJoin(int32_t lineJoin) {
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

   static winrt::Microsoft::Graphics::Canvas::Geometry::CanvasFilledRegionDetermination GetFillRule(int32_t fillRule) {
     switch (fillRule) {
       case 0:
         return winrt::Microsoft::Graphics::Canvas::Geometry::CanvasFilledRegionDetermination::Alternate;
       case 1:
       default:
         return winrt::Microsoft::Graphics::Canvas::Geometry::CanvasFilledRegionDetermination::Winding;
     }
   }

   static winrt::Microsoft::Graphics::Canvas::Brushes::ICanvasBrush GetCanvasBrush(
       winrt::com_ptr<ID2D1Brush> brushD2D) {
     auto canvasDevice{winrt::Microsoft::Graphics::Canvas::CanvasDevice::GetSharedDevice()};
     winrt::com_ptr<::IInspectable> brushAsInspectable{nullptr};

     auto factory{winrt::get_activation_factory<
         winrt::Microsoft::Graphics::Canvas::CanvasDevice,
         ABI::Microsoft::Graphics::Canvas::ICanvasFactoryNative>()};

     try {
     winrt::check_hresult(factory->GetOrCreate(
         canvasDevice.as<ABI::Microsoft::Graphics::Canvas::ICanvasDevice>().get(),
         brushD2D.as<::IUnknown>().get(),
         0.0f,
         brushAsInspectable.put()));
     } catch (winrt::hresult_error const &e) {
       winrt::hresult hr = e.code();
     }

     return brushAsInspectable.as<winrt::Microsoft::Graphics::Canvas::Brushes::ICanvasBrush>();
   }

   static D2D1::ColorF AsD2DColor(winrt::Windows::UI::Color const& color) {
     return {
         color.R / 255.0f,
         color.G / 255.0f,
         color.B / 255.0f,
         color.A / 255.0f};
   }

   static winrt::Windows::UI::Color FromD2DColor(D2D1::ColorF const color) {
     return winrt::Windows::UI::ColorHelper::FromArgb(color.a, color.r, color.g, color.b);
   }
};
} // namespace winrt::RNSVG
