#pragma once
#include "DefsViewManager.g.h"
#include "GroupViewManager.h"

namespace winrt::RNSVG::implementation {
struct DefsViewManager : DefsViewManagerT<DefsViewManager, RNSVG::implementation::GroupViewManager> {
  DefsViewManager();
};
} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation {
struct DefsViewManager : DefsViewManagerT<DefsViewManager, implementation::DefsViewManager> {};
} // namespace winrt::RNSVG::factory_implementation
