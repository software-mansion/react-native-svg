#include "pch.h"
#include "PatternViewManager.h"
#include "PatternViewManager.g.cpp"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
PatternViewManager::PatternViewManager() {
  m_class = RNSVG::SVGClass::RNSVGPattern;
  m_name = L"RNSVGPattern";
}

IMapView<hstring, ViewManagerPropertyType> PatternViewManager::NativeProps() {
  auto const &parentProps{__super::NativeProps()};
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  for (auto const &prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"x", ViewManagerPropertyType::String);
  nativeProps.Insert(L"y", ViewManagerPropertyType::String);
  nativeProps.Insert(L"width", ViewManagerPropertyType::String);
  nativeProps.Insert(L"height", ViewManagerPropertyType::String);
  nativeProps.Insert(L"patternUnits", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"patternContentUnits", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"patternTransform", ViewManagerPropertyType::Array);
  nativeProps.Insert(L"minX", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"minY", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"vbWidth", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"vbHeight", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"align", ViewManagerPropertyType::String);
  nativeProps.Insert(L"meetOrSlice", ViewManagerPropertyType::Number);

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
