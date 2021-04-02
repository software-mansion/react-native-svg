#include "pch.h"
#include "UseViewManager.h"
#include "UseViewManager.g.cpp"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
UseViewManager::UseViewManager() {
  m_class = RNSVG::SVGClass::RNSVGUse;
  m_name = L"RNSVGUse";
}

IMapView<hstring, ViewManagerPropertyType> UseViewManager::NativeProps() {
  auto const &parentProps{__super::NativeProps()};
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  for (auto const &prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"href", ViewManagerPropertyType::String);
  nativeProps.Insert(L"x", ViewManagerPropertyType::String);
  nativeProps.Insert(L"y", ViewManagerPropertyType::String);
  nativeProps.Insert(L"width", ViewManagerPropertyType::String);
  nativeProps.Insert(L"height", ViewManagerPropertyType::String);

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
