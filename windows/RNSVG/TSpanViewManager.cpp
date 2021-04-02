#include "pch.h"
#include "TSpanViewManager.h"
#include "TSpanViewManager.g.cpp"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
TSpanViewManager::TSpanViewManager() {
  m_class = RNSVG::SVGClass::RNSVGTSpan;
  m_name = L"RNSVGTSpan";
}

Windows::Foundation::Collections::IMapView<hstring, ViewManagerPropertyType> TSpanViewManager::NativeProps() {
  auto const &parentProps{__super::NativeProps()};
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  for (auto const &prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"content", ViewManagerPropertyType::String);

  return nativeProps.GetView();
}
}
