#pragma once
#include "PatternViewManager.g.h"
#include "GroupViewManager.h"

namespace winrt::RNSVG::implementation {
struct PatternViewManager : PatternViewManagerT<PatternViewManager, RNSVG::implementation::GroupViewManager> {
  PatternViewManager();

  // IViewManagerWithNativeProperties
  Windows::Foundation::Collections::IMapView<hstring, Microsoft::ReactNative::ViewManagerPropertyType> NativeProps();
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct PatternViewManager : PatternViewManagerT<PatternViewManager, implementation::PatternViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
