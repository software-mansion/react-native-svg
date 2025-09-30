#include "pch.h"
#include "RadialGradientViewManager.h"
#if __has_include("RadialGradientViewManager.g.cpp")
#include "RadialGradientViewManager.g.cpp"
#endif

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
RadialGradientViewManager::RadialGradientViewManager() {
  m_class = RNSVG::SVGClass::RNSVGRadialGradient;
  m_name = L"RNSVGRadialGradient";
}

IMapView<hstring, ViewManagerPropertyType> RadialGradientViewManager::NativeProps() {
  auto const &parentProps{__super::NativeProps()};
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  for (auto const &prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"fx", ViewManagerPropertyType::String);
  nativeProps.Insert(L"fy", ViewManagerPropertyType::String);
  nativeProps.Insert(L"rx", ViewManagerPropertyType::String);
  nativeProps.Insert(L"ry", ViewManagerPropertyType::String);
  nativeProps.Insert(L"cx", ViewManagerPropertyType::String);
  nativeProps.Insert(L"cy", ViewManagerPropertyType::String);
  nativeProps.Insert(L"gradient", ViewManagerPropertyType::Array);
  nativeProps.Insert(L"gradientUnits", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"gradientTransform", ViewManagerPropertyType::Array);

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
