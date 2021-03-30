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
#include "TextViewManager.h"
#include "TSpanViewManager.h"

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
    packageBuilder.AddViewManager(L"TextViewManager", []() { return winrt::make<TextViewManager>(); });
    packageBuilder.AddViewManager(L"TSpanViewManager", []() { return winrt::make<TSpanViewManager>(); });
  }

} // namespace winrt::RNSVG::implementation
