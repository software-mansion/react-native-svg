#pragma once
#include "TextViewManager.g.h"
#include "GroupViewManager.h"

namespace winrt::RNSVG::implementation {
struct TextViewManager : TextViewManagerT<TextViewManager, RNSVG::implementation::GroupViewManager> {
  TextViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
};
} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation {
struct TextViewManager : TextViewManagerT<TextViewManager, implementation::TextViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
