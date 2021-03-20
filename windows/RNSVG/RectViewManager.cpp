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
  auto parentProps{__super::NativeProps()};
  auto nativeProps = winrt::single_threaded_map<hstring, ViewManagerPropertyType>();

  for (auto prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"height", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"width", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"x", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"y", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"rx", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"ry", ViewManagerPropertyType::Number);

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
