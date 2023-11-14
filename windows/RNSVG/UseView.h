#pragma once
#include "UseView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {
struct UseView : UseViewT<UseView, RNSVG::implementation::RenderableView> {
 public:
  UseView() = default;

  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
  void Draw(RNSVG::D2DDeviceContext const &deviceContext, Windows::Foundation::Size const &size);

 private:
  hstring m_href{L""};
  RNSVG::SVGLength m_x{};
  RNSVG::SVGLength m_y{};
  RNSVG::SVGLength m_width{};
  RNSVG::SVGLength m_height{};

  RNSVG::IRenderable GetRenderableTemplate();
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct UseView : UseViewT<UseView, implementation::UseView> {};
} // namespace winrt::RNSVG::factory_implementation
