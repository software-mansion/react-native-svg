#include "pch.h"
#include "UnsupportedSvgViewManager.h"
#if __has_include("UnsupportedSvgViewManager.g.cpp")
#include "UnsupportedSvgViewManager.g.cpp"
#endif

#include <UI.Input.h>
#include <UI.Xaml.Input.h>
#include <UI.Xaml.Media.h>
#include <UI.Xaml.Shapes.h>

#include "RenderableView.h"

namespace winrt::RNSVG::implementation {
UnsupportedSvgViewManager::UnsupportedSvgViewManager(hstring name) {m_name = name;}
// IViewManager
hstring UnsupportedSvgViewManager::Name() {
  return m_name;
}

xaml::FrameworkElement UnsupportedSvgViewManager::CreateView() {
  xaml::Controls::TextBlock tb;
  tb.Text(L"Unsupported SVG Element: " + m_name);
  tb.Foreground(xaml::Media::SolidColorBrush(winrt::Windows::UI::Colors::Red()));
  return tb;
}

// IViewManagerWithContext
winrt::Microsoft::ReactNative::IReactContext UnsupportedSvgViewManager::ReactContext() {
  return m_reactContext;
}

void UnsupportedSvgViewManager::ReactContext(winrt::Microsoft::ReactNative::IReactContext const &reactContext) {
  m_reactContext = reactContext;
}

// IViewManagerWithChildren
void UnsupportedSvgViewManager::AddView(xaml::FrameworkElement const &parent, xaml::UIElement const &child, int64_t /*index*/) {
}

void UnsupportedSvgViewManager::RemoveAllChildren(xaml::FrameworkElement const &parent) {
}

void UnsupportedSvgViewManager::RemoveChildAt(xaml::FrameworkElement const &parent, int64_t /*index*/) {
}

void UnsupportedSvgViewManager::ReplaceChild(
    xaml::FrameworkElement const &parent,
    xaml::UIElement const &oldChild,
    xaml::UIElement const &newChild) {
}
} // namespace winrt::RNSVG::implementation
