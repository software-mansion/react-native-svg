#include "pch.h"
#include "PathViewManager.h"
#if __has_include("PathViewManager.g.cpp")
#include "PathViewManager.g.cpp"
#endif

#include "PathViewManager.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
PathViewManager::PathViewManager() {
  m_class = RNSVG::SVGClass::RNSVGPath;
  m_name = L"RNSVGPath";
}

// IViewManagerWithNativeProperties
IMapView<hstring, ViewManagerPropertyType> PathViewManager::NativeProps() {
  auto parentProps{__super::NativeProps()};
  auto nativeProps = winrt::single_threaded_map<hstring, ViewManagerPropertyType>();

  for (auto prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"d", ViewManagerPropertyType::String);

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
