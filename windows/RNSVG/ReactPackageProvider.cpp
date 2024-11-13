#include "pch.h"
#include "ReactPackageProvider.h"
#if __has_include("ReactPackageProvider.g.cpp")
#include "ReactPackageProvider.g.cpp"
#endif

#include "RNSVGModule.h"

#ifdef USE_FABRIC
#include "Fabric/SvgView.h"
#include "Fabric/RectView.h"
#include "Fabric/CircleView.h"
#include "Fabric/EllipseView.h"
#include "Fabric/LineView.h"
#include "Fabric/PathView.h"
#include "Fabric/ImageView.h"
#include "Fabric/UseView.h"
#include "Fabric/GroupView.h"
#include "Fabric/DefsView.h"
#include "Fabric/ClipPathView.h"
#include "Fabric/LinearGradientView.h"
#include "Fabric/RadialGradientView.h"
#include "Fabric/UnsupportedSvgView.h"
#else
#include "SvgViewManager.h"
#include "GroupViewManager.h"
#include "RectViewManager.h"
#include "CircleViewManager.h"
#include "EllipseViewManager.h"
#include "LineViewManager.h"
#include "PathViewManager.h"
#include "ImageViewManager.h"
#include "UseViewManager.h"
#include "SymbolViewManager.h"
#include "DefsViewManager.h"
#include "ClipPathViewManager.h"
#include "MarkerViewManager.h"
#include "MaskViewManager.h"
#include "LinearGradientViewManager.h"
#include "RadialGradientViewManager.h"
#include "PatternViewManager.h"
#include "TextViewManager.h"
#include "TSpanViewManager.h"
#endif

using namespace winrt::Microsoft::ReactNative;

namespace winrt::RNSVG::implementation
{
  void ReactPackageProvider::CreatePackage(IReactPackageBuilder const &packageBuilder) noexcept
  {
    AddAttributedModules(packageBuilder);

#ifdef USE_FABRIC
    auto fabricPackageBuilder = packageBuilder.as<winrt::Microsoft::ReactNative::IReactPackageBuilderFabric>();

    SvgView::RegisterComponent(fabricPackageBuilder);
    RegisterRectComponent(fabricPackageBuilder);
    RegisterCircleComponent(fabricPackageBuilder);
    RegisterEllipseComponent(fabricPackageBuilder);
    RegisterUnsupportedSvgComponent(L"RNSVGFilter", fabricPackageBuilder);
    RegisterUnsupportedSvgComponent(L"RNSVGFeBlend", fabricPackageBuilder);
    RegisterUnsupportedSvgComponent(L"RNSVGFeColorMatrix", fabricPackageBuilder);
    RegisterUnsupportedSvgComponent(L"RNSVGFeComposite", fabricPackageBuilder);
    RegisterUnsupportedSvgComponent(L"RNSVGFeFlood", fabricPackageBuilder);
    RegisterUnsupportedSvgComponent(L"RNSVGFeGaussianBlur", fabricPackageBuilder);
    RegisterUnsupportedSvgComponent(L"RNSVGFeMerge", fabricPackageBuilder);
    RegisterUnsupportedSvgComponent(L"RNSVGFeOffset", fabricPackageBuilder);
    RegisterUnsupportedSvgComponent(L"RNSVGForeignObject", fabricPackageBuilder);
    RegisterLineComponent(fabricPackageBuilder);
    RegisterPathComponent(fabricPackageBuilder);
    RegisterImageComponent(fabricPackageBuilder);
    RegisterUseComponent(fabricPackageBuilder);
    RegisterGroupComponent(fabricPackageBuilder);
    RegisterUnsupportedSvgComponent(L"RNSVGSymbol", fabricPackageBuilder);
    RegisterDefsComponent(fabricPackageBuilder);
    RegisterClipPathComponent(fabricPackageBuilder);
    RegisterUnsupportedSvgComponent(L"RNSVGMarker", fabricPackageBuilder);
    RegisterUnsupportedSvgComponent(L"RNSVGMask", fabricPackageBuilder);
    RegisterLinearGradientComponent(fabricPackageBuilder);
    RegisterRadialGradientComponent(fabricPackageBuilder);
    RegisterUnsupportedSvgComponent(L"RNSVGPattern", fabricPackageBuilder);
    RegisterUnsupportedSvgComponent(L"RNSVGText", fabricPackageBuilder);
    RegisterUnsupportedSvgComponent(L"RNSVGTSpan", fabricPackageBuilder);
#else
    packageBuilder.AddViewManager(L"SvgViewManager", []() { return winrt::make<SvgViewManager>(); });
    packageBuilder.AddViewManager(L"RectViewManager", []() { return winrt::make<RectViewManager>(); });
    packageBuilder.AddViewManager(L"CircleViewManager", []() { return winrt::make<CircleViewManager>(); });
    packageBuilder.AddViewManager(L"EllipseViewManager", []() { return winrt::make<EllipseViewManager>(); });
    packageBuilder.AddViewManager(L"LineViewManager", []() { return winrt::make<LineViewManager>(); });
    packageBuilder.AddViewManager(L"PathViewManager", []() { return winrt::make<PathViewManager>(); });
    packageBuilder.AddViewManager(L"ImageViewManager", []() { return winrt::make<ImageViewManager>(); });
    packageBuilder.AddViewManager(L"UseViewManager", []() { return winrt::make<UseViewManager>(); });
    packageBuilder.AddViewManager(L"GroupViewManager", []() { return winrt::make<GroupViewManager>(); });
    packageBuilder.AddViewManager(L"SymbolViewManager", []() { return winrt::make<SymbolViewManager>(); });
    packageBuilder.AddViewManager(L"DefsViewManager", []() { return winrt::make<DefsViewManager>(); });
    packageBuilder.AddViewManager(L"ClipPathViewManager", []() { return winrt::make<ClipPathViewManager>(); });
    packageBuilder.AddViewManager(L"MarkerViewManager", []() { return winrt::make<MarkerViewManager>(); });
    packageBuilder.AddViewManager(L"MaskViewManager", []() { return winrt::make<MaskViewManager>(); });
    packageBuilder.AddViewManager(L"LinearGradientViewManager", []() { return winrt::make<LinearGradientViewManager>(); });
    packageBuilder.AddViewManager(L"RadialGradientViewManager", []() { return winrt::make<RadialGradientViewManager>(); });
    packageBuilder.AddViewManager(L"PatternViewManager", []() { return winrt::make<PatternViewManager>(); });
    packageBuilder.AddViewManager(L"TextViewManager", []() { return winrt::make<TextViewManager>(); });
    packageBuilder.AddViewManager(L"TSpanViewManager", []() { return winrt::make<TSpanViewManager>(); });
#endif

  }

} // namespace winrt::RNSVG::implementation
