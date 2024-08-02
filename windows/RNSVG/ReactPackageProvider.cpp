#include "pch.h"
#include "ReactPackageProvider.h"
#if __has_include("ReactPackageProvider.g.cpp")
#include "ReactPackageProvider.g.cpp"
#endif

#include "RNSVGModule.h"
#include "SvgViewManager.h"
#include "GroupViewManager.h"
#include "PathViewManager.h"
#include "RectViewManager.h"
#include "CircleViewManager.h"
#include "EllipseViewManager.h"
#include "LineViewManager.h"
#include "UseViewManager.h"
#include "ImageViewManager.h"
#include "TextViewManager.h"
#include "TSpanViewManager.h"
#include "SymbolViewManager.h"
#include "DefsViewManager.h"
#include "LinearGradientViewManager.h"
#include "RadialGradientViewManager.h"
#include "PatternViewManager.h"
#include "ClipPathViewManager.h"
#include "MarkerViewManager.h"
#include "MaskViewManager.h"

using namespace winrt::Microsoft::ReactNative;

namespace winrt::RNSVG::implementation
{
  void ReactPackageProvider::CreatePackage(IReactPackageBuilder const &packageBuilder) noexcept
  {
    AddAttributedModules(packageBuilder);
    packageBuilder.AddViewManager(L"SvgViewManager", []() { return winrt::make<SvgViewManager>(); });
    packageBuilder.AddViewManager(L"GroupViewManager", []() { return winrt::make<GroupViewManager>(); });
    packageBuilder.AddViewManager(L"PathViewManager", []() { return winrt::make<PathViewManager>(); });
    packageBuilder.AddViewManager(L"RectViewManager", []() { return winrt::make<RectViewManager>(); });
    packageBuilder.AddViewManager(L"CircleViewManager", []() { return winrt::make<CircleViewManager>(); });
    packageBuilder.AddViewManager(L"EllipseViewManager", []() { return winrt::make<EllipseViewManager>(); });
    packageBuilder.AddViewManager(L"LineViewManager", []() { return winrt::make<LineViewManager>(); });
    packageBuilder.AddViewManager(L"UseViewManager", []() { return winrt::make<UseViewManager>(); });
    packageBuilder.AddViewManager(L"ImageViewManager", []() { return winrt::make<ImageViewManager>(); });
    packageBuilder.AddViewManager(L"TextViewManager", []() { return winrt::make<TextViewManager>(); });
    packageBuilder.AddViewManager(L"TSpanViewManager", []() { return winrt::make<TSpanViewManager>(); });
    packageBuilder.AddViewManager(L"SymbolViewManager", []() { return winrt::make<SymbolViewManager>(); });
    packageBuilder.AddViewManager(L"DefsViewManager", []() { return winrt::make<DefsViewManager>(); });
    packageBuilder.AddViewManager(L"LinearGradientViewManager", []() { return winrt::make<LinearGradientViewManager>(); });
    packageBuilder.AddViewManager(L"RadialGradientViewManager", []() { return winrt::make<RadialGradientViewManager>(); });
    packageBuilder.AddViewManager(L"PatternViewManager", []() { return winrt::make<PatternViewManager>(); });
    packageBuilder.AddViewManager(L"ClipPathViewManager", []() { return winrt::make<ClipPathViewManager>(); });
    packageBuilder.AddViewManager(L"MarkerViewManager", []() { return winrt::make<MarkerViewManager>(); });
    packageBuilder.AddViewManager(L"MaskViewManager", []() { return winrt::make<MaskViewManager>(); });
  }

} // namespace winrt::RNSVG::implementation
