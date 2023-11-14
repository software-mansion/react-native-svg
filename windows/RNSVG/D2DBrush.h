#pragma once
#include "D2DBrush.g.h"

namespace winrt::RNSVG::implementation {
struct D2DBrush : D2DBrushT<D2DBrush> {
 public:
  D2DBrush() = default;
  D2DBrush(com_ptr<ID2D1Brush> const &brush) { m_d2d = brush; }

  com_ptr<ID2D1Brush> Get() { return m_d2d; }

 private:
  com_ptr<ID2D1Brush> m_d2d;
};

} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation {
struct D2DBrush : D2DBrushT<D2DBrush, implementation::D2DBrush> {};
} // namespace winrt::RNSVG::factory_implementation
