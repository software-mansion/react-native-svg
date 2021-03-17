#pragma once
#include "GroupView.g.h"

#include "SvgView.h"

namespace winrt::RNSVG::implementation
{
  struct GroupView : GroupViewT<GroupView>
  {
    GroupView() = default;

   public:
    GroupView(Microsoft::ReactNative::IReactContext const &context);
    void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader);

    void SetParent(weak_ref<SvgView> parent) { m_parent = parent; }
    winrt::com_ptr<SvgView> GetParent() { return m_parent.get(); }

    void AddChild(RenderableView const &child);

    // Overrides
    Windows::Foundation::Size MeasureOverride(Windows::Foundation::Size availableSize);
    Windows::Foundation::Size ArrangeOverride(Windows::Foundation::Size finalSize);

    void DrawChildren(Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const& canvas, Microsoft::Graphics::Canvas::CanvasDrawingSession const& session);
    void InvalidateCanvas();

   private:
    Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
    weak_ref<SvgView> m_parent;
    std::vector<RenderableView> m_children{};
  };
} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation
{
  struct GroupView : GroupViewT<GroupView, implementation::GroupView>
  {
  };
} // namespace winrt::RNSVG::factory_implementation
