#pragma once

#include "DirectXDeviceManager.g.h"

namespace winrt::RNSVG::implementation {

struct DirectXDeviceManager : DirectXDeviceManagerT<DirectXDeviceManager> {
  DirectXDeviceManager() = default;

  winrt::RNSVG::D2DDevice Device() {
    return m_device;
  }

  winrt::RNSVG::D2DDeviceContext DeviceContext() {
    return m_deviceContext;
  }

  void CreateDeviceResources();
  void DiscardDeviceResources();

 private:
  winrt::RNSVG::D2DDevice m_device;
  winrt::RNSVG::D2DDeviceContext m_deviceContext;
  bool m_hasDeviceResources{false};
};
} // namespace winrt::RNSVG::implementation 

namespace winrt::RNSVG::factory_implementation {
struct DirectXDeviceManager : DirectXDeviceManagerT<DirectXDeviceManager, implementation::DirectXDeviceManager> {};
} // namespace winrt::RNSVG::factory_implementation