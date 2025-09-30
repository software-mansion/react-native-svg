#include "pch.h"
#include "MaskViewManager.h"
#if __has_include("MaskViewManager.g.cpp")
#include "MaskViewManager.g.cpp"
#endif

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
MaskViewManager::MaskViewManager() {
  m_class = RNSVG::SVGClass::RNSVGMask;
  m_name = L"RNSVGMask";
}

IMapView<hstring, ViewManagerPropertyType> MaskViewManager::NativeProps() {
  auto const &parentProps{__super::NativeProps()};
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  for (auto const &prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
