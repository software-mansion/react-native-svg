#include "pch.h"
#include "TestViewManager.h"
#if __has_include("TestViewManager.g.cpp")
#include "TestViewManager.g.cpp"
#endif

#include <UI.Input.h>
#include <UI.Xaml.Input.h>
#include <UI.Xaml.Media.h>
#include <UI.Xaml.Shapes.h>

#include "RenderableView.h"

namespace winrt::RNSVG::implementation {
TestViewManager::TestViewManager(hstring name) {m_name = name;}
// IViewManager
hstring TestViewManager::Name() {
  return m_name;
}

xaml::FrameworkElement TestViewManager::CreateView() {
  return winrt::RNSVG::SvgView(m_reactContext);
}

// IViewManagerWithContext
winrt::Microsoft::ReactNative::IReactContext TestViewManager::ReactContext() {
  return m_reactContext;
}

void TestViewManager::ReactContext(winrt::Microsoft::ReactNative::IReactContext const &reactContext) {
  m_reactContext = reactContext;
}

// IViewManagerWithNativeProperties
IMapView<hstring, winrt::Microsoft::ReactNative::ViewManagerPropertyType> TestViewManager::NativeProps() {
  auto const &nativeProps{
      winrt::single_threaded_map<hstring, winrt::Microsoft::ReactNative::ViewManagerPropertyType>()};
  return nativeProps.GetView();
}

void TestViewManager::UpdateProperties(
    xaml::FrameworkElement const &view,
    winrt::Microsoft::ReactNative::IJSValueReader const &propertyMapReader) {}

// IViewManagerWithChildren
void TestViewManager::AddView(xaml::FrameworkElement const &parent, xaml::UIElement const &child, int64_t /*index*/) {
}

void TestViewManager::RemoveAllChildren(xaml::FrameworkElement const &parent) {
}

void TestViewManager::RemoveChildAt(xaml::FrameworkElement const &parent, int64_t /*index*/) {
}

void TestViewManager::ReplaceChild(
    xaml::FrameworkElement const &parent,
    xaml::UIElement const &oldChild,
    xaml::UIElement const &newChild) {
}

void TestViewManager::OnPointerEvent(
    IInspectable const &view,
    winrt::Microsoft::ReactNative::ReactPointerEventArgs const &args) {}
} // namespace winrt::RNSVG::implementation
