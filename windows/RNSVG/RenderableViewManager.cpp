#include "pch.h"
#include "RenderableViewManager.h"
#if __has_include("RenderableViewManager.g.cpp")
#include "RenderableViewManager.g.cpp"
#endif

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
Windows::UI::Xaml::FrameworkElement RenderableViewManager::CreateView() {
  switch (m_class) {
    case RNSVG::SVGClass::RNSVGGroup:
      return winrt::RNSVG::GroupView(m_reactContext);
    case RNSVG::SVGClass::RNSVGPath:
      return winrt::RNSVG::PathView();
    case RNSVG::SVGClass::RNSVGRect:
      return winrt::RNSVG::RectView();
    case RNSVG::SVGClass::RNSVGCircle:
      return winrt::RNSVG::CircleView();
    case RNSVG::SVGClass::RNSVGEllipse:
      return winrt::RNSVG::EllipseView();
    case RNSVG::SVGClass::RNSVGLine:
      return winrt::RNSVG::LineView();
    case RNSVG::SVGClass::RNSVGUse:
      return winrt::RNSVG::UseView();
    case RNSVG::SVGClass::RNSVGImage:
      return winrt::RNSVG::ImageView();
    case RNSVG::SVGClass::RNSVGText:
      return winrt::RNSVG::TextView();
    case RNSVG::SVGClass::RNSVGTSpan:
      return winrt::RNSVG::TSpanView();
    case RNSVG::SVGClass::RNSVGSymbol:
      return winrt::RNSVG::SymbolView();
    case RNSVG::SVGClass::RNSVGDefs:
      return winrt::RNSVG::DefsView();
    case RNSVG::SVGClass::RNSVGLinearGradient:
      return winrt::RNSVG::LinearGradientView();
    case RNSVG::SVGClass::RNSVGRadialGradient:
      return winrt::RNSVG::RadialGradientView();
    case RNSVG::SVGClass::RNSVGPattern:
      return winrt::RNSVG::PatternView();
    case RNSVG::SVGClass::RNSVGClipPath:
      return winrt::RNSVG::ClipPathView();
  }

  throw hresult_not_implemented();
}

// IViewManagerWithNativeProperties
IMapView<hstring, ViewManagerPropertyType> RenderableViewManager::NativeProps() {
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  nativeProps.Insert(L"name", ViewManagerPropertyType::String);
  nativeProps.Insert(L"fill", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"fillRule", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"fillOpacity", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"stroke", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"strokeOpacity", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"strokeWidth", ViewManagerPropertyType::String);
  nativeProps.Insert(L"strokeLinecap", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"strokeLinejoin", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"strokeMiterlimit", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"strokeDashoffset", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"strokeDasharray", ViewManagerPropertyType::Array);
  nativeProps.Insert(L"matrix", ViewManagerPropertyType::Array);
  nativeProps.Insert(L"opacity", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"propList", ViewManagerPropertyType::Array);
  nativeProps.Insert(L"clipPath", ViewManagerPropertyType::String);
  nativeProps.Insert(L"responsible", ViewManagerPropertyType::Boolean);

  return nativeProps.GetView();
}

void RenderableViewManager::UpdateProperties(
    Windows::UI::Xaml::FrameworkElement const &view,
    Microsoft::ReactNative::IJSValueReader const &propertyMapReader) {
  if (auto const &renderable{view.try_as<RenderableView>()}) {
    renderable->UpdateProperties(propertyMapReader);
  }
}
} // namespace winrt::RNSVG::implementation
