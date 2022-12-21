#include "pch.h"
#include "ImageViewManager.h"
#include "ImageViewManager.g.cpp"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
ImageViewManager::ImageViewManager() {
  m_class = RNSVG::SVGClass::RNSVGImage;
  m_name = L"RNSVGImage";
}

IMapView<hstring, ViewManagerPropertyType> ImageViewManager::NativeProps() {
  auto const &parentProps{__super::NativeProps()};
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  for (auto const &prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"x", ViewManagerPropertyType::String);
  nativeProps.Insert(L"y", ViewManagerPropertyType::String);
  nativeProps.Insert(L"height", ViewManagerPropertyType::String);
  nativeProps.Insert(L"width", ViewManagerPropertyType::String);
  nativeProps.Insert(L"src", ViewManagerPropertyType::String);

  // preserveAspectRatio
  nativeProps.Insert(L"align", ViewManagerPropertyType::String);
  nativeProps.Insert(L"meetOrSlice", ViewManagerPropertyType::Number);

  return nativeProps.GetView();
}
}
