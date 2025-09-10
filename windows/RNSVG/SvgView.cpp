#include "pch.h"

#include "SvgView.h"
#if __has_include("SvgView.g.cpp")
#include "SvgView.g.cpp"
#endif

#include <UI.Xaml.Media.Imaging.h>
#ifdef USE_WINUI3
#include <microsoft.ui.xaml.media.dxinterop.h>
#include <winrt/Microsoft.Graphics.Display.h>
#else
#include <windows.ui.xaml.media.dxinterop.h>
#include <winrt/Windows.Graphics.Display.h>
#endif

#include "D2DDevice.h"
#include "D2DDeviceContext.h"
#include "GroupView.h"

#include <d3d11_4.h>

using namespace winrt;

namespace winrt::RNSVG::implementation {

SvgView::SvgView(IReactContext const &context, RNSVG::DirectXDeviceManager const &deviceManager)
    : m_reactContext(context), m_deviceManager(deviceManager) {
  m_panelLoadedRevoker = Loaded(winrt::auto_revoke, {get_weak(), &SvgView::Panel_Loaded});
  m_panelUnloadedRevoker = Unloaded(winrt::auto_revoke, {get_weak(), &SvgView::Panel_Unloaded});
}

void SvgView::SvgParent(xaml::FrameworkElement const &value) {
  if (value) {
    m_panelUnloadedRevoker.revoke();
    m_parent = value;
  }
}

void SvgView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  // If forceUpdate is false, that means this is a nested Svg
  // and we're inheriting props. Pass those along to the group.
  if (!forceUpdate && m_group) {
    m_group.UpdateProperties(reader, forceUpdate, invalidate);
  } else {
    auto const &propertyMap{JSValueObject::ReadFrom(reader)};

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
        m_width = propertyValue.To<RNSVG::SVGLength>();
      } else if (propertyName == "height") {
        m_height = propertyValue.To<RNSVG::SVGLength>();
      } else if (propertyName == "bbWidth") {
        m_bbWidth = propertyValue.To<RNSVG::SVGLength>();
        Width(m_bbWidth.Value);
      } else if (propertyName == "bbHeight") {
        m_bbHeight = propertyValue.To<RNSVG::SVGLength>();
        Height(m_bbHeight.Value);
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

Size SvgView::MeasureOverride(Size const &availableSize) {
  for (auto const &child : Children()) {
    child.Measure(availableSize);
  }
  return availableSize;
}

Size SvgView::ArrangeOverride(Size const &finalSize) {
  for (auto const &child : Children()) {
    child.Arrange({0, 0, finalSize.Width, finalSize.Height});
  }
  return finalSize;
}

void SvgView::Panel_Loaded(IInspectable const &sender, xaml::RoutedEventArgs const & ) {
  if (auto const &svgView{sender.try_as<RNSVG::SvgView>()}) { 
    if (!m_loaded) { 
      m_loaded = true; 
      svgView.CreateResources();
    }
  }
}

void SvgView::Panel_Unloaded(IInspectable const &sender, xaml::RoutedEventArgs const & ) {
  if (auto const &svgView{sender.try_as<RNSVG::SvgView>()}) {
    svgView.Unload();
  }
}

winrt::Windows::Foundation::Size SvgView::CanvasSize() noexcept {
  return ActualSize();
}

void SvgView::SaveDefinition() {
  if (m_id != L"" && m_group) {
    m_group.SvgRoot().Templates().Insert(m_id, *this);
    m_group.SaveDefinition();
  }
}

void SvgView::MergeProperties(RNSVG::IRenderable const &other) {
  if (m_group) {
    m_group.MergeProperties(other);
  }
}

void SvgView::Draw(RNSVG::D2DDeviceContext const &context, Size const &size) {
  com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(context)->Get()};

  D2D1_MATRIX_3X2_F transform{D2DHelpers::GetTransform(deviceContext.get())};

  if (m_align != "") {
    Rect vbRect{m_minX, m_minY, m_vbWidth, m_vbHeight};
    float width{size.Width};
    float height{size.Height};

    if (SvgParent()) {
      width = Utils::GetAbsoluteLength(m_bbWidth, width);
      height = Utils::GetAbsoluteLength(m_bbHeight, height);
    }

    Rect elRect{0, 0, width, height};
    deviceContext->SetTransform(Utils::GetViewBoxTransformD2D(vbRect, elRect, m_align, m_meetOrSlice) * transform);
  }

  if (m_group) {
    m_group.SaveDefinition();
    m_group.Draw(context, size);
  }

  if (!m_hasRendered) {
    m_hasRendered = true;
  }

  deviceContext->SetTransform(transform);
}

void SvgView::CreateGeometry(RNSVG::D2DDeviceContext const &context) {
  if (m_group) {
    m_group.CreateGeometry(context);
  }
}

void SvgView::CreateResources() {
  if (m_group) {
    m_group.CreateResources();
  }

  Invalidate();

  m_image.Width(ActualWidth());
  m_image.Height(ActualHeight());
  m_image.Stretch(xaml::Media::Stretch::UniformToFill);
  Children().Append(m_image);
}

void SvgView::Unload() {
  m_reactContext = nullptr;
  m_templates.Clear();
  m_brushes.Clear();

  if (m_group) {
    m_group.Unload();
  }
}

void SvgView::Invalidate() {
  m_brushes.Clear();
  m_templates.Clear();

  // Recreate the shared graphics device resources if necessary.
  m_deviceManager.CreateDeviceResourcesIfNeeded();

  if (!m_loaded || Device() == nullptr || DeviceContext() == nullptr) {
    return;
  }

  com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(DeviceContext())->Get()};

  Size size{static_cast<float>(ActualWidth()), static_cast<float>(ActualHeight())};

  // Check if the size is valid (non-zero)
  if (size.Width <= 0 || size.Height <= 0) {
    return;
  }

  xaml::Media::Imaging::SurfaceImageSource surfaceImageSource(
      static_cast<int32_t>(size.Width), static_cast<int32_t>(size.Height));
  com_ptr<ISurfaceImageSourceNativeWithD2D> sisNativeWithD2D{surfaceImageSource.as<ISurfaceImageSourceNativeWithD2D>()};

  // Associate the Direct2D device with the SurfaceImageSource.
  com_ptr<ID2D1Device> device{get_self<D2DDevice>(Device())->Get()};
  sisNativeWithD2D->SetDevice(device.get());

  com_ptr<IDXGISurface> dxgiSurface;

  // RECT is a LTRB rect, but since we're using 0 for LT, we are using width/height for RB.
  RECT updateRect{0, 0, static_cast<long>(size.Width), static_cast<long>(size.Height)};
  POINT offset{0, 0};
  check_hresult(sisNativeWithD2D->BeginDraw(updateRect, __uuidof(IDXGISurface), dxgiSurface.put_void(), &offset));

  // Create render target.
  com_ptr<ID2D1Bitmap1> bitmap;
  check_hresult(deviceContext->CreateBitmapFromDxgiSurface(dxgiSurface.get(), nullptr, bitmap.put()));

  // Set context's render target.
  deviceContext->SetTarget(bitmap.get());

  // Draw using Direct2D context
  deviceContext->BeginDraw();

  auto transform = Numerics::make_float3x2_translation({static_cast<float>(offset.x), static_cast<float>(offset.y)});
  deviceContext->SetTransform(D2DHelpers::AsD2DTransform(transform));

  deviceContext->Clear(D2D1::ColorF(D2D1::ColorF::Black, 0.0f));

  Draw(DeviceContext(), size);

  HRESULT endDrawResult = deviceContext->EndDraw();
  HRESULT sisNativeEndDrawResult = sisNativeWithD2D->EndDraw();

  // If either draw call failed with D2DERR_RECREATE_TARGET, then discard the current device resources.
  if (endDrawResult == D2DERR_RECREATE_TARGET || sisNativeEndDrawResult == D2DERR_RECREATE_TARGET) {
    m_deviceManager.DiscardDeviceResources();
  }

  m_image.Source(surfaceImageSource);
}
} // namespace winrt::RNSVG::implementation
