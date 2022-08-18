#pragma once
#include "TSpanViewManager.g.h"
#include "TextViewManager.h"

namespace winrt::RNSVG::implementation {
struct TSpanViewManager : TSpanViewManagerT<TSpanViewManager, RNSVG::implementation::TextViewManager> {
  TSpanViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
};
} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation {
struct TSpanViewManager : TSpanViewManagerT<TSpanViewManager, implementation::TSpanViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
