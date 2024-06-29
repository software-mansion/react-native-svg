#include "pch.h"
#include "DefsViewManager.h"
#if __has_include("DefsViewManager.g.cpp")
#include "DefsViewManager.g.cpp"
#endif

namespace winrt::RNSVG::implementation {
DefsViewManager::DefsViewManager() {
  m_class = RNSVG::SVGClass::RNSVGDefs;
  m_name = L"RNSVGDefs";
}
} // namespace winrt::RNSVG::implementation
