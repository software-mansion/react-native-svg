#include "pch.h"
#include "EllipseViewManager.h"
#include "EllipseViewManager.g.cpp"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
EllipseViewManager::EllipseViewManager() {
  m_class = RNSVG::SVGClass::RNSVGEllipse;
  m_name = L"RNSVGEllipse";
}

Windows::Foundation::Collections::IMapView<hstring, ViewManagerPropertyType> EllipseViewManager::NativeProps() {
  auto parentProps{__super::NativeProps()};
  auto nativeProps = winrt::single_threaded_map<hstring, ViewManagerPropertyType>();

  for (auto prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"cx", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"cy", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"rx", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"ry", ViewManagerPropertyType::Number);

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
