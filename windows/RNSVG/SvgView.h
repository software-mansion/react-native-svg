#pragma once

#include "SvgView.g.h"

namespace winrt::RNSVG::implementation
{
  struct SvgView : SvgViewT<SvgView>
  {
    SvgView() = default;

    SvgView(Microsoft::ReactNative::IReactContext const &context);
    void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader);

    // Overrides
    winrt::Windows::Foundation::Size MeasureOverride(winrt::Windows::Foundation::Size availableSize);
    winrt::Windows::Foundation::Size ArrangeOverride(winrt::Windows::Foundation::Size finalSize);

   private:
    Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
  };
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation
{
  struct SvgView : SvgViewT<SvgView, implementation::SvgView>
  {
  };
} // namespace winrt::RNSVG::factory_implementation
