#include "pch.h"

#include "SvgView.h"
#if __has_include("SvgView.g.cpp")
#include "SvgView.g.cpp"
#endif

#include <windows.ui.xaml.media.dxinterop.h>
#include <winrt/Windows.UI.Xaml.Media.Imaging.h>
#include <winrt/Windows.Graphics.Display.h>

#include "GroupView.h"
#include "Utils.h"

#include <d3d11_4.h>

namespace winrt::RNSVG::implementation {
SvgView::SvgView(Microsoft::ReactNative::IReactContext const &context) : m_reactContext(context) {
  //m_scale = static_cast<float>(Windows::Graphics::Display::DisplayInformation::GetForCurrentView().ResolutionScale()) / 100;

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
  com_ptr<ID3D11Device> d3dDevice;
  D3D_FEATURE_LEVEL supportedFeatureLevel;
  check_hresult(D3D11CreateDevice(
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

  com_ptr<IDXGIDevice> dxgiDevice{d3dDevice.as<IDXGIDevice>()};

  // Create the Direct2D device and a corresponding context.
  check_hresult(D2D1CreateDevice(dxgiDevice.get(), nullptr, m_device.put()));

  check_hresult(m_device->CreateDeviceContext(D2D1_DEVICE_CONTEXT_OPTIONS_NONE, m_deviceContext.put()));

  //m_panelUnloadedRevoker = Unloaded(winrt::auto_revoke, {get_weak(), &SvgView::Panel_Unloaded});
  m_panelLoadedRevoker = Loaded(winrt::auto_revoke, {get_weak(), &SvgView::Panel_Loaded});
}

void SvgView::SvgParent(xaml::FrameworkElement const &value) {
  if (value) {
    //m_canvasDrawRevoker.revoke();
    //m_canvasCreateResourcesRevoker.revoke();
    //m_canvasSizeChangedRevoker.revoke();
    m_panelUnloadedRevoker.revoke();
    //m_canvas.RemoveFromVisualTree();
    //m_canvas = nullptr;
    m_parent = value;
  }
}

void SvgView::UpdateProperties(
    Microsoft::ReactNative::IJSValueReader const &reader,
    bool forceUpdate,
    bool invalidate) {
  // If forceUpdate is false, that means this is a nested Svg
  // and we're inheriting props. Pass those along to the group.
  if (!forceUpdate && m_group) {
    m_group.UpdateProperties(reader, forceUpdate, invalidate);
  } else {
    auto const &propertyMap{Microsoft::ReactNative::JSValueObject::ReadFrom(reader)};

    for (auto const &pair : propertyMap) {
      auto const &propertyName{pair.first};
      auto const &propertyValue{pair.second};

      if (propertyName == "name") {
        if (m_parent && m_group) {
          m_group.SvgRoot().Templates().Remove(m_id);
        }
        m_id = to_hstring(Utils::JSValueAsString(propertyValue));
        if (m_parent) {
          SaveDefinition();
        }
      } else if (propertyName == "width") {
        m_width = SVGLength::From(propertyValue);
      } else if (propertyName == "height") {
        m_height = SVGLength::From(propertyValue);
      } else if (propertyName == "bbWidth") {
        m_bbWidth = SVGLength::From(propertyValue);
        Width(m_bbWidth.Value());
      } else if (propertyName == "bbHeight") {
        m_bbHeight = SVGLength::From(propertyValue);
        Height(m_bbHeight.Value());
      } else if (propertyName == "vbWidth") {
        m_vbWidth = Utils::JSValueAsFloat(propertyValue);
      } else if (propertyName == "vbHeight") {
        m_vbHeight = Utils::JSValueAsFloat(propertyValue);
      } else if (propertyName == "minX") {
        m_minX = Utils::JSValueAsFloat(propertyValue);
      } else if (propertyName == "minY") {
        m_minY = Utils::JSValueAsFloat(propertyValue);
      } else if (propertyName == "align") {
        m_align = Utils::JSValueAsString(propertyValue);
      } else if (propertyName == "meetOrSlice") {
        m_meetOrSlice = Utils::GetMeetOrSlice(propertyValue);
      } else if (propertyName == "color") {
        m_currentColor = Utils::JSValueAsColor(propertyValue);
      } else if (propertyName == "responsible") {
        m_isResponsible = propertyValue.AsBoolean();
      }
    }

    Invalidate();
  }
}

void SvgView::SaveDefinition() {
  if (m_id != L"" && m_group) {
    m_group.SvgRoot().Templates().Insert(m_id, *this);
    m_group.SaveDefinition();
  }
}

void SvgView::MergeProperties(RNSVG::RenderableView const &other) {
  if (m_group) {
    m_group.MergeProperties(other);
  }
}

Size SvgView::MeasureOverride(Size availableSize) {
  for (auto const &child : Children()) {
    child.Measure(availableSize);
  }
  return availableSize;
}

Size SvgView::ArrangeOverride(Size finalSize) {
  for (auto const &child : Children()) {
    child.Arrange({0, 0, finalSize.Width, finalSize.Height});
  }
  return finalSize;
}

void SvgView::Draw() {
  if (!m_hasRendered) {
    m_hasRendered = true;
  }

  m_brushes.Clear();
  m_templates.Clear();

  if (!m_parent) {
    xaml::Media::Imaging::SurfaceImageSource surfaceImageSource(
        static_cast<int32_t>(ActualWidth()), static_cast<int32_t>(ActualHeight()));
    com_ptr<ISurfaceImageSourceNativeWithD2D> sisNativeWithD2D{
        surfaceImageSource.as<ISurfaceImageSourceNativeWithD2D>()};

    // Associate the Direct2D device with the SurfaceImageSource.
    sisNativeWithD2D->SetDevice(m_device.get());

    com_ptr<IDXGISurface> dxgiSurface;

    RECT updateRect{0, 0, static_cast<long>(ActualWidth()), static_cast<long>(ActualHeight())};
    POINT offset{0,0};
    check_hresult(sisNativeWithD2D->BeginDraw(updateRect, __uuidof(IDXGISurface), dxgiSurface.put_void(), &offset));

    // Create render target.
    com_ptr<ID2D1Bitmap1> bitmap;
    check_hresult(m_deviceContext->CreateBitmapFromDxgiSurface(dxgiSurface.get(), nullptr, bitmap.put()));

    // Set context's render target.
    m_deviceContext->SetTarget(bitmap.get());

    // Draw using Direct2D context
    m_deviceContext->BeginDraw();

    auto transform = Numerics::make_float3x2_translation({static_cast<float>(offset.x), static_cast<float>(offset.y)});
    m_deviceContext->SetTransform(D2DHelpers::AsD2DTransform(transform));

    m_deviceContext->Clear(D2D1::ColorF(D2D1::ColorF::Orange, 0.0f));

    Draw(m_deviceContext.get());

    m_deviceContext->EndDraw();

    sisNativeWithD2D->EndDraw();

    m_image.Source(surfaceImageSource);
  } else {
    com_ptr<ID2D1DeviceContext1> deviceContext;
    copy_to_abi(m_group.SvgRoot().DeviceContext(), *deviceContext.put_void());
    Draw(deviceContext.get());
  }
}

void SvgView::Draw(ID2D1DeviceContext* deviceContext) {
  if (m_align != "") {
    Rect vbRect{m_minX * m_scale, m_minY * m_scale, m_vbWidth * m_scale, m_vbHeight * m_scale};
    //Rect vbRect{m_minX, m_minY, m_vbWidth, m_vbHeight};
    float width{static_cast<float>(ActualWidth())};
    float height{static_cast<float>(ActualHeight())};

    if (m_parent) {
      width = Utils::GetAbsoluteLength(m_bbWidth, width);
      height = Utils::GetAbsoluteLength(m_bbHeight, height);
    }

    Rect elRect{0, 0, width, height};

    deviceContext->SetTransform(
        D2DHelpers::AsD2DTransform(Utils::GetViewBoxTransform(vbRect, elRect, m_align, m_meetOrSlice)));
  }

  if (m_group) {
    m_group.SaveDefinition();
    m_group.Draw();
  }
}

void SvgView::CreateGeometry() {
  if (m_group) {
    m_group.CreateGeometry();
  }
}

void SvgView::CreateResources() {
  if (m_group) {
    m_group.CreateResources();
  }

  Draw();

  m_image.Width(ActualWidth());
  m_image.Height(ActualHeight());
  m_image.Stretch(xaml::Media::Stretch::UniformToFill);

  Children().Append(m_image);
}

void SvgView::Panel_Loaded(IInspectable const &sender, xaml::RoutedEventArgs const & /*args*/) {
  if (auto const &svgView{sender.try_as<RNSVG::SvgView>()}) {
    svgView.CreateResources();
  }
}

void SvgView::Panel_Unloaded(IInspectable const &sender, xaml::RoutedEventArgs const & /*args*/) {
  if (auto const &svgView{sender.try_as<RNSVG::SvgView>()}) {
    svgView.Unload();
  }
}

void SvgView::Unload() {
  m_reactContext = nullptr;
  m_templates.Clear();
  m_brushes.Clear();

  if (m_group) {
    m_group.Unload();
  }

  //if (m_canvas) {
  //  m_canvas.RemoveFromVisualTree();
  //  m_canvas = nullptr;
  //}
}

void SvgView::Invalidate() {
  if (m_hasRendered) {
    //Draw();
  }
}
} // namespace winrt::RNSVG::implementation
