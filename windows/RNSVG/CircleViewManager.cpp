#include "pch.h"
#include "CircleViewManager.h"
#include "CircleViewManager.g.cpp"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
CircleViewManager::CircleViewManager() {
  m_class = RNSVG::SVGClass::RNSVGCircle;
  m_name = L"RNSVGCircle";
}

Windows::Foundation::Collections::IMapView<hstring, ViewManagerPropertyType>
CircleViewManager::NativeProps() {

  auto parentProps{__super::NativeProps()};
  auto nativeProps = winrt::single_threaded_map<hstring, ViewManagerPropertyType>();

  for (auto prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"cx", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"cy", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"r", ViewManagerPropertyType::Number);

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
