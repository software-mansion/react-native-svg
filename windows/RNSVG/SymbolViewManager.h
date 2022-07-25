#pragma once
#include "SymbolViewManager.g.h"
#include "GroupViewManager.h"

namespace winrt::RNSVG::implementation {
struct SymbolViewManager : SymbolViewManagerT<SymbolViewManager, RNSVG::implementation::GroupViewManager> {
  SymbolViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct SymbolViewManager : SymbolViewManagerT<SymbolViewManager, implementation::SymbolViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
