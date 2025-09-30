#pragma once

#include "DirectXDeviceManager.g.h"

namespace winrt::RNSVG::implementation {

// DirectXDeviceManager is a helper struct that is responsible for handling the creation, caching, and destruction of
// various DirectX device resources. Only one D2DDevice and one D2DDeviceContext should be needed to render any and all
// SvgView objects. Creating a new D2DDevice for each SvgView is unneccessary and can cause performance issues when
// trying to render many SvgView objects.
struct DirectXDeviceManager : DirectXDeviceManagerT<DirectXDeviceManager> {
  DirectXDeviceManager() = default;

  winrt::RNSVG::D2DDevice Device() { return m_device; }
  winrt::RNSVG::D2DDeviceContext DeviceContext() { return m_deviceContext; }

  // Creates new graphics device resources if the current resources are null or have been discarded.
  void CreateDeviceResourcesIfNeeded();

  // Discards the current set of graphics device resources to reset them back to null. This allows
  // CreateDeviceResourcesIfNeeded to create new resources when it is next called.
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