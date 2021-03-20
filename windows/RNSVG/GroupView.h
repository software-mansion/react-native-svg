#pragma once
#include "RenderableView.h"
#include "GroupView.g.h"

namespace winrt::RNSVG::implementation
{
  struct GroupView : GroupViewT<GroupView, RNSVG::implementation::RenderableView>
  {
  public:
    GroupView() = default;
    GroupView(Microsoft::ReactNative::IReactContext const &context) : m_reactContext(context) {}

    Windows::Foundation::Collections::IVector<RNSVG::RenderableView> Children() { return m_children; }

    void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool invalidate);

    void Render(
        Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const& canvas,
        Microsoft::Graphics::Canvas::CanvasDrawingSession const& session);

    void RenderGroup(
        Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &canvas,
        Microsoft::Graphics::Canvas::CanvasDrawingSession const &session);

  private:
    Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
    Windows::Foundation::Collections::IVector<RNSVG::RenderableView> m_children{
        winrt::single_threaded_vector<RNSVG::RenderableView>()};
  };
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation
{
  struct GroupView : GroupViewT<GroupView, implementation::GroupView>
  {
  };
}

