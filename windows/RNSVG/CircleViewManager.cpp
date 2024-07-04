#include "pch.h"
#include "CircleViewManager.h"
#if __has_include("CircleViewManager.g.cpp")
#include "CircleViewManager.g.cpp"
#endif

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
CircleViewManager::CircleViewManager() {
  m_class = RNSVG::SVGClass::RNSVGCircle;
  m_name = L"RNSVGCircle";
}

IMapView<hstring, ViewManagerPropertyType> CircleViewManager::NativeProps() {
  auto const &parentProps{__super::NativeProps()};
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  for (auto const &prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"cx", ViewManagerPropertyType::String);
  nativeProps.Insert(L"cy", ViewManagerPropertyType::String);
  nativeProps.Insert(L"r", ViewManagerPropertyType::String);

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
