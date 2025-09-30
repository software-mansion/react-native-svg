#include "pch.h"
#include "EllipseViewManager.h"
#if __has_include("EllipseViewManager.g.cpp")
#include "EllipseViewManager.g.cpp"
#endif

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
EllipseViewManager::EllipseViewManager() {
  m_class = RNSVG::SVGClass::RNSVGEllipse;
  m_name = L"RNSVGEllipse";
}

IMapView<hstring, ViewManagerPropertyType> EllipseViewManager::NativeProps() {
  auto const &parentProps{__super::NativeProps()};
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  for (auto const &prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"cx", ViewManagerPropertyType::String);
  nativeProps.Insert(L"cy", ViewManagerPropertyType::String);
  nativeProps.Insert(L"rx", ViewManagerPropertyType::String);
  nativeProps.Insert(L"ry", ViewManagerPropertyType::String);

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
