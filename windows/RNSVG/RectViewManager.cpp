#include "pch.h"
#include "RectViewManager.h"
#if __has_include("RectViewManager.g.cpp")
#include "RectViewManager.g.cpp"
#endif

#include "RectView.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
RectViewManager::RectViewManager() {
  m_class = RNSVG::SVGClass::RNSVGRect;
  m_name = L"RNSVGRect";
}

// IViewManagerWithNativeProperties
IMapView<hstring, ViewManagerPropertyType> RectViewManager::NativeProps() {
  auto const &parentProps{__super::NativeProps()};
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  for (auto const &prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"height", ViewManagerPropertyType::String);
  nativeProps.Insert(L"width", ViewManagerPropertyType::String);
  nativeProps.Insert(L"x", ViewManagerPropertyType::String);
  nativeProps.Insert(L"y", ViewManagerPropertyType::String);
  nativeProps.Insert(L"rx", ViewManagerPropertyType::String);
  nativeProps.Insert(L"ry", ViewManagerPropertyType::String);

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
