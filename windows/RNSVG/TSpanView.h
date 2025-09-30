#pragma once

#include "TSpanView.g.h"
#include "TextView.h"

namespace winrt::RNSVG::implementation {
  
struct TSpanView : TSpanViewT<TSpanView, RNSVG::implementation::TextView> {
public:
  TSpanView() = default;

  // IRenderablePaper
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);

  // IRenderable
  virtual void Draw(RNSVG::D2DDeviceContext const &deviceContext, Windows::Foundation::Size const &size);

 private:
  std::string m_content;
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct TSpanView : TSpanViewT<TSpanView, implementation::TSpanView> {};
} // namespace winrt::RNSVG::factory_implementation
