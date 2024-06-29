#include "pch.h"
#include "ReactPackageProvider.h"
#if __has_include("ReactPackageProvider.g.cpp")
#include "ReactPackageProvider.g.cpp"
#endif

#include "RNSVGModule.h"

#ifdef USE_FABRIC
#include "SvgView.h"
#include "RectView.h"
#include "CircleView.h"
#include "EllipseView.h"
#include "LineView.h"
#include "PathView.h"
#include "ImageView.h"
#include "UseView.h"
#include "GroupView.h"
#include "SymbolView.h"
#include "DefsView.h"
#include "ClipPathView.h"
#include "MarkerView.h"
#include "MaskView.h"
#include "LinearGradientView.h"
#include "RadialGradientView.h"
#include "PatternView.h"
#include "TextView.h"
#include "TSpanView.h"
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
    RectView::RegisterComponent(fabricPackageBuilder);
    CircleView::RegisterComponent(fabricPackageBuilder);
    EllipseView::RegisterComponent(fabricPackageBuilder);
    LineView::RegisterComponent(fabricPackageBuilder);
    PathView::RegisterComponent(fabricPackageBuilder);
    ImageView::RegisterComponent(fabricPackageBuilder);
    UseView::RegisterComponent(fabricPackageBuilder);
    GroupView::RegisterComponent(fabricPackageBuilder);
    SymbolView::RegisterComponent(fabricPackageBuilder);
    DefsView::RegisterComponent(fabricPackageBuilder);
    ClipPathView::RegisterComponent(fabricPackageBuilder);
    MarkerView::RegisterComponent(fabricPackageBuilder);
    MaskView::RegisterComponent(fabricPackageBuilder);
    LinearGradientView::RegisterComponent(fabricPackageBuilder);
    RadialGradientView::RegisterComponent(fabricPackageBuilder);
    PatternView::RegisterComponent(fabricPackageBuilder);
    TextView::RegisterComponent(fabricPackageBuilder);
    TSpanView::RegisterComponent(fabricPackageBuilder);
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
