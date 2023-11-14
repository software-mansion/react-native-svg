#pragma once
#include "D2DDeviceContext.g.h"

namespace winrt::RNSVG::implementation {
struct D2DDeviceContext : D2DDeviceContextT<D2DDeviceContext> {
 public:
  D2DDeviceContext() = default;
  D2DDeviceContext(com_ptr<ID2D1DeviceContext> const & deviceContext) { m_d2d = deviceContext;}

  com_ptr<ID2D1DeviceContext> Get() { return m_d2d; }

 private:
  com_ptr<ID2D1DeviceContext> m_d2d;
};

} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation {
struct D2DDeviceContext : D2DDeviceContextT<D2DDeviceContext, implementation::D2DDeviceContext> {};
} // namespace winrt::RNSVG::factory_implementation
