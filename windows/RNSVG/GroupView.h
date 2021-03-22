#pragma once
#include "RenderableGroupView.h"
#include "GroupView.g.h"

namespace winrt::RNSVG::implementation {
struct GroupView : GroupViewT<GroupView, RNSVG::implementation::RenderableGroupView> {
 public:
  GroupView() = default;
  GroupView(Microsoft::ReactNative::IReactContext const &context) : m_reactContext(context) {}

 private:
  Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct GroupView : GroupViewT<GroupView, implementation::GroupView> {};
} // namespace winrt::RNSVG::factory_implementation
