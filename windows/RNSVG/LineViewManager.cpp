#include "pch.h"
#include "LineViewManager.h"
#if __has_include("LineViewManager.g.cpp")
#include "LineViewManager.g.cpp"
#endif

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
LineViewManager::LineViewManager() {
  m_class = RNSVG::SVGClass::RNSVGLine;
  m_name = L"RNSVGLine";
}

IMapView<hstring, ViewManagerPropertyType> LineViewManager::NativeProps() {
  auto const &parentProps{__super::NativeProps()};
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  for (auto const &prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"x1", ViewManagerPropertyType::String);
  nativeProps.Insert(L"y1", ViewManagerPropertyType::String);
  nativeProps.Insert(L"x2", ViewManagerPropertyType::String);
  nativeProps.Insert(L"y2", ViewManagerPropertyType::String);

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
