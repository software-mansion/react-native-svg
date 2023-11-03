#pragma once
#include "D2DDevice.g.h"

namespace winrt::RNSVG::implementation {
struct D2DDevice : D2DDeviceT<D2DDevice> {
 public:
  D2DDevice() = default;
  D2DDevice(com_ptr<ID2D1Device> const &device) { m_d2d = device; }

  com_ptr<ID2D1Device> Get() { return m_d2d; }

 private:
  com_ptr<ID2D1Device> m_d2d;
};

} // namespace winrt::RNSVG::implementation
namespace winrt::RNSVG::factory_implementation {
struct D2DDevice : D2DDeviceT<D2DDevice, implementation::D2DDevice> {};
} // namespace winrt::RNSVG::factory_implementation
