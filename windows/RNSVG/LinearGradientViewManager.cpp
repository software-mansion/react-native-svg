#include "pch.h"
#include "LinearGradientViewManager.h"
#if __has_include("LinearGradientViewManager.g.cpp")
#include "LinearGradientViewManager.g.cpp"
#endif

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
LinearGradientViewManager::LinearGradientViewManager() {
  m_class = RNSVG::SVGClass::RNSVGLinearGradient;
  m_name = L"RNSVGLinearGradient";
}

IMapView<hstring, ViewManagerPropertyType> LinearGradientViewManager::NativeProps() {
  auto const& parentProps{__super::NativeProps()};
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  for (auto const &prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"x1", ViewManagerPropertyType::String);
  nativeProps.Insert(L"y1", ViewManagerPropertyType::String);
  nativeProps.Insert(L"x2", ViewManagerPropertyType::String);
  nativeProps.Insert(L"y2", ViewManagerPropertyType::String);
  nativeProps.Insert(L"gradient", ViewManagerPropertyType::Array);
  nativeProps.Insert(L"gradientUnits", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"gradientTransform", ViewManagerPropertyType::Array);

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
