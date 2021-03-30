#include "pch.h"
#include "LineViewManager.h"
#include "LineViewManager.g.cpp"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
LineViewManager::LineViewManager() {
  m_class = RNSVG::SVGClass::RNSVGLine;
  m_name = L"RNSVGLine";
}

Windows::Foundation::Collections::IMapView<hstring, ViewManagerPropertyType> LineViewManager::NativeProps() {
  auto parentProps{__super::NativeProps()};
  auto nativeProps = winrt::single_threaded_map<hstring, ViewManagerPropertyType>();

  for (auto prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"x1", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"y1", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"x2", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"y2", ViewManagerPropertyType::Number);

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
