#pragma once
#include "TextView.g.h"
#include "GroupView.h"

namespace winrt::RNSVG::implementation {
struct TextView : TextViewT<TextView, RNSVG::implementation::GroupView> {
 public:
  TextView() = default;

  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> X() { return m_x; }
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> Y() { return m_y; }
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> DX() { return m_dx; }
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> DY() { return m_dy; }
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> Rotate() { return m_rotate; }

  virtual void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
  virtual void RenderGroup(
      Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &canvas,
      Microsoft::Graphics::Canvas::CanvasDrawingSession const &session);

 private:
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> m_x{winrt::single_threaded_vector<RNSVG::SVGLength>()};
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> m_y{winrt::single_threaded_vector<RNSVG::SVGLength>()};
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> m_dx{winrt::single_threaded_vector<RNSVG::SVGLength>()};
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> m_dy{winrt::single_threaded_vector<RNSVG::SVGLength>()};
  Windows::Foundation::Collections::IVector<RNSVG::SVGLength> m_rotate{winrt::single_threaded_vector<RNSVG::SVGLength>()};
};
} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation {
struct TextView : TextViewT<TextView, implementation::TextView> {};
} // namespace winrt::RNSVG::factory_implementation
