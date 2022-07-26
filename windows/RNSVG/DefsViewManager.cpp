#include "pch.h"
#include "DefsViewManager.h"
#include "DefsViewManager.g.cpp"

namespace winrt::RNSVG::implementation {
DefsViewManager::DefsViewManager() {
  m_class = RNSVG::SVGClass::RNSVGDefs;
  m_name = L"RNSVGDefs";
}
} // namespace winrt::RNSVG::implementation
