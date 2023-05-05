#pragma once
#include "DefsView.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {
struct DefsView : DefsViewT<DefsView, RNSVG::implementation::GroupView> {
  DefsView() = default;

  void Draw();
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct DefsView : DefsViewT<DefsView, implementation::DefsView> {};
} // namespace winrt::RNSVG::factory_implementation
