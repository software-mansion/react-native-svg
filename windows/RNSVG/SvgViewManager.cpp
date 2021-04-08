#include "pch.h"
#include "SvgViewManager.h"
#if __has_include("SvgViewManager.g.cpp")
#include "SvgViewManager.g.cpp"
#endif

#include <winrt/Windows.UI.Xaml.Media.h>
#include <winrt/Windows.UI.Xaml.Shapes.h>

#include "RenderableView.h"
#include "SvgView.h"

namespace winrt {
using namespace Windows::Foundation::Collections;
using namespace Microsoft::Graphics::Canvas::UI::Xaml;
using namespace Microsoft::ReactNative;
using namespace Windows::UI::Xaml;
using namespace Windows::UI::Xaml::Controls;
} // namespace winrt

namespace winrt::RNSVG::implementation {
// IViewManager
hstring SvgViewManager::Name() {
  return L"RNSVGSvgView";
}

FrameworkElement SvgViewManager::CreateView() {
  return winrt::RNSVG::SvgView(m_reactContext);
}

// IViewManagerWithContext
IReactContext SvgViewManager::ReactContext() {
  return m_reactContext;
}

void SvgViewManager::ReactContext(IReactContext const &reactContext) {
  m_reactContext = reactContext;
}

// IViewManagerWithNativeProperties
IMapView<hstring, ViewManagerPropertyType> SvgViewManager::NativeProps() {
  auto const &nativeProps{winrt::single_threaded_map<hstring, ViewManagerPropertyType>()};

  nativeProps.Insert(L"height", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"width", ViewManagerPropertyType::Number);

  // viewBox
  nativeProps.Insert(L"minX", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"minY", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"vbWidth", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"vbHeight", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"bbWidth", ViewManagerPropertyType::Number);
  nativeProps.Insert(L"bbHeight", ViewManagerPropertyType::Number);

  // preserveAspectRatio
  nativeProps.Insert(L"align", ViewManagerPropertyType::String);
  nativeProps.Insert(L"meetOrSlice", ViewManagerPropertyType::Number);

  return nativeProps.GetView();
}

void SvgViewManager::UpdateProperties(FrameworkElement const &view, IJSValueReader const &propertyMapReader) {
  if (auto const &svgView{view.try_as<SvgView>()}) {
    svgView->UpdateProperties(propertyMapReader);
  }
}

// IViewManagerWithChildren
void SvgViewManager::AddView(FrameworkElement const &parent, UIElement const &child, int64_t /*index*/) {
  auto const &svgView{parent.try_as<RNSVG::SvgView>()};
  auto const &group{child.try_as<RNSVG::GroupView>()};

  if (svgView && group) {
    // Every SvgView has exactly one child - a Group that gets
    // all of Svg's children piped through.
    group.SvgParent(parent);
    svgView.Group(group);
  }
}

void SvgViewManager::RemoveAllChildren(FrameworkElement const &parent) {
  auto const &svgView{parent.try_as<RNSVG::SvgView>()};
  if (svgView && svgView.Group()) {
    svgView.Group().Unload();
  }
  svgView.Group(nullptr);
}

void SvgViewManager::RemoveChildAt(FrameworkElement const &parent, int64_t /*index*/) {
  RemoveAllChildren(parent);
}

void SvgViewManager::ReplaceChild(
    FrameworkElement const &parent,
    UIElement const &oldChild,
    UIElement const &newChild) {
  auto const &svgView{parent.try_as<RNSVG::SvgView>()};
  auto const &oldGroup{oldChild.try_as<RNSVG::GroupView>()};
  auto const &newGroup{newChild.try_as<RNSVG::GroupView>()};

  if (svgView && oldGroup && newGroup) {
    newGroup.MergeProperties(oldGroup);
    oldGroup.Unload();
    newGroup.SvgParent(parent);
    svgView.Group(newGroup);
  }
}
} // namespace winrt::RNSVG::implementation
