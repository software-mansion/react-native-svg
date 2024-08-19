#include "pch.h"
#include "MarkerViewManager.h"
#if __has_include("MarkerViewManager.g.cpp")
#include "MarkerViewManager.g.cpp"
#endif

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
MarkerViewManager::MarkerViewManager() {
  m_class = RNSVG::SVGClass::RNSVGMarker;
  m_name = L"RNSVGMarker";
}

IMapView<hstring, ViewManagerPropertyType> MarkerViewManager::NativeProps() {
  auto const &parentProps{__super::NativeProps()};
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  for (auto const &prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
