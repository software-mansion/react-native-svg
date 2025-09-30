#include "pch.h"
#include "SymbolViewManager.h"
#if __has_include("SymbolViewManager.g.cpp")
#include "SymbolViewManager.g.cpp"
#endif

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation
{
SymbolViewManager::SymbolViewManager() {
  m_class = RNSVG::SVGClass::RNSVGSymbol;
  m_name = L"RNSVGSymbol";
}

IMapView<hstring, ViewManagerPropertyType> SymbolViewManager::NativeProps() {
  auto const &parentProps{__super::NativeProps()};
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  for (auto const &prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"minX", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"minY", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"vbWidth", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"vbHeight", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"align", ViewManagerPropertyType::String);
  nativeProps.Insert(L"meetOrSlice", ViewManagerPropertyType::Number);

  return nativeProps.GetView();
}
}
