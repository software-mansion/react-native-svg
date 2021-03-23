#include "pch.h"
#include "GroupViewManager.h"
#if __has_include("GroupViewManager.g.cpp")
#include "GroupViewManager.g.cpp"
#endif

#include "GroupView.h"

#include <winrt/Windows.UI.Xaml.Shapes.h>

using namespace winrt;
using namespace Microsoft::ReactNative;

using namespace Windows::Foundation;
using namespace Windows::Foundation::Collections;
using namespace Windows::UI::Xaml;

namespace winrt::RNSVG::implementation {
GroupViewManager::GroupViewManager() {
  m_class = RNSVG::SVGClass::RNSVGGroup;
  m_name = L"RNSVGGroup";
}

// IViewManagerWithNativeProperties
IMapView<hstring, ViewManagerPropertyType> GroupViewManager::NativeProps() {
  auto parentProps{__super::NativeProps()};
  auto nativeProps = winrt::single_threaded_map<hstring, ViewManagerPropertyType>();

  for (auto prop : parentProps) {
    nativeProps.Insert(prop.Key(), prop.Value());
  }

  nativeProps.Insert(L"font", ViewManagerPropertyType::Map);

  return nativeProps.GetView();
}

// IViewManagerWithChildren
void GroupViewManager::AddView(FrameworkElement const &parent, UIElement const &child, int64_t /*index*/) {
  if (auto groupView{parent.try_as<RNSVG::GroupView>()}) {
    if (auto childView{child.try_as<RNSVG::RenderableView>()}) {
      childView.SvgParent(parent);
      groupView.AddChild(childView);
    }
  }
}

void GroupViewManager::RemoveAllChildren(FrameworkElement const &parent) {
  if (auto groupView{parent.try_as<RNSVG::GroupView>()}) {
    for (auto child : groupView.Children()) {
      child.SvgParent(nullptr);
    }

    groupView.Children().Clear();
  }
}

void GroupViewManager::RemoveChildAt(FrameworkElement const &parent, int64_t index) {
  if (auto groupView{parent.try_as<RNSVG::GroupView>()}) {
    auto child{groupView.Children().GetAt(static_cast<uint32_t>(index))};
    child.SvgParent(nullptr);

    groupView.Children().RemoveAt(static_cast<uint32_t>(index));
  }
}

void GroupViewManager::ReplaceChild(
    FrameworkElement const &parent,
    UIElement const &oldChild,
    UIElement const &newChild) {
  auto groupView{parent.try_as<RNSVG::GroupView>()};
  auto oldChildView{oldChild.try_as<RNSVG::RenderableView>()};
  auto newChildView{newChild.try_as<RNSVG::RenderableView>()};

  if (groupView && oldChildView && newChildView) {
    uint32_t index;

    if (groupView.Children().IndexOf(oldChildView, index)) {
      groupView.Children().RemoveAt(index);
      oldChildView.SvgParent(nullptr);
      newChildView.SvgParent(parent);
      groupView.AddChild(newChildView);
    }
  }
}
} // namespace winrt::RNSVG::implementation
