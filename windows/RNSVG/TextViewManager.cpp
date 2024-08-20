#include "pch.h"
#include "TextViewManager.h"
#if __has_include("TextViewManager.g.cpp")
#include "TextViewManager.g.cpp"
#endif

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
TextViewManager::TextViewManager() {
  m_class = RNSVG::SVGClass::RNSVGText;
  m_name = L"RNSVGText";
}

Windows::Foundation::Collections::IMapView<hstring, ViewManagerPropertyType> TextViewManager::NativeProps() {
  auto const &parentProps{__super::NativeProps()};
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  for (auto const &prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"x", ViewManagerPropertyType::Array);
  nativeProps.Insert(L"y", ViewManagerPropertyType::Array);
  nativeProps.Insert(L"dx", ViewManagerPropertyType::Array);
  nativeProps.Insert(L"dy", ViewManagerPropertyType::Array);
  nativeProps.Insert(L"rotate", ViewManagerPropertyType::Array);

  return nativeProps.GetView();
}
} // namespace winrt::RNSVG::implementation
