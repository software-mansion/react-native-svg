#include "pch.h"
#include "DirectXDeviceManager.h"

#if __has_include("DirectXDeviceManager.g.cpp")
#include "DirectXDeviceManager.g.cpp"
#endif

#include "D2DDevice.h"
#include "D2DDeviceContext.h"
#include <d3d11_4.h>

namespace winrt::RNSVG::implementation {

void DirectXDeviceManager::CreateDeviceResourcesIfNeeded() {
  if (!m_hasDeviceResources) {
    uint32_t creationFlags = D3D11_CREATE_DEVICE_BGRA_SUPPORT;

    D3D_FEATURE_LEVEL featureLevels[] = {
        D3D_FEATURE_LEVEL_11_1,
        D3D_FEATURE_LEVEL_11_0,
        D3D_FEATURE_LEVEL_10_1,
        D3D_FEATURE_LEVEL_10_0,
        D3D_FEATURE_LEVEL_9_3,
        D3D_FEATURE_LEVEL_9_2,
        D3D_FEATURE_LEVEL_9_1};

    // Create the Direct3D device.
    winrt::com_ptr<ID3D11Device> d3dDevice;
    D3D_FEATURE_LEVEL supportedFeatureLevel;
    winrt::check_hresult(D3D11CreateDevice(
        nullptr, // default adapter
        D3D_DRIVER_TYPE_HARDWARE,
        0,
        creationFlags,
        featureLevels,
        ARRAYSIZE(featureLevels),
        D3D11_SDK_VERSION,
        d3dDevice.put(),
        &supportedFeatureLevel,
        nullptr));

    winrt::com_ptr<IDXGIDevice> dxgiDevice{d3dDevice.as<IDXGIDevice>()};

    // Create the Direct2D device and a corresponding context.
    winrt::com_ptr<ID2D1Device> device;
    winrt::check_hresult(D2D1CreateDevice(dxgiDevice.get(), nullptr, device.put()));
    m_device = winrt::make<winrt::RNSVG::implementation::D2DDevice>(device);

    winrt::com_ptr<ID2D1DeviceContext> deviceContext;
    winrt::check_hresult(device->CreateDeviceContext(D2D1_DEVICE_CONTEXT_OPTIONS_NONE, deviceContext.put()));
    m_deviceContext = winrt::make<winrt::RNSVG::implementation::D2DDeviceContext>(deviceContext);

    m_hasDeviceResources = true;
  }
}

void DirectXDeviceManager::DiscardDeviceResources() {
  m_hasDeviceResources = false;
  if (m_device.as<winrt::RNSVG::implementation::D2DDevice>()->Get() != nullptr) {
    m_device.as<winrt::RNSVG::implementation::D2DDevice>()->Get()->Release();
  }

  if (m_deviceContext.as<winrt::RNSVG::implementation::D2DDeviceContext>()->Get() != nullptr) {
    m_deviceContext.as<winrt::RNSVG::implementation::D2DDeviceContext>()->Get()->Release();
  }
}
} // namespace winrt::RNSVG::implementation