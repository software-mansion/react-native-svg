#include "pch.h"
#include "ClipPathViewManager.h"
#include "ClipPathViewManager.g.cpp"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
ClipPathViewManager::ClipPathViewManager() {
  m_class = RNSVG::SVGClass::RNSVGClipPath;
  m_name = L"RNSVGClipPath";
}

IMapView<hstring, ViewManagerPropertyType> ClipPathViewManager::NativeProps() {
  auto const &parentProps{__super::NativeProps()};
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  for (auto const &prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
