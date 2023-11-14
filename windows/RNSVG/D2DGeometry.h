#pragma once
#include "D2DGeometry.g.h"

namespace winrt::RNSVG::implementation {
struct D2DGeometry : D2DGeometryT<D2DGeometry> {
 public:
  D2DGeometry() = default;
  D2DGeometry(com_ptr<ID2D1Geometry> const &geometry) {m_d2d = geometry;}

  com_ptr<ID2D1Geometry> Get() { return m_d2d; }

 private:
   com_ptr<ID2D1Geometry> m_d2d;
};

} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation {
struct D2DGeometry : D2DGeometryT<D2DGeometry, implementation::D2DGeometry> {};
} // namespace winrt::RNSVG::factory_implementation
