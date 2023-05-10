#include "pch.h"
#include "PatternView.h"
#include "PatternView.g.cpp"

#include "Utils.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void PatternView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "x") {
      m_x = SVGLength::From(propertyValue);
    } else if (propertyName == "y") {
      m_y = SVGLength::From(propertyValue);
    } else if (propertyName == "width") {
      m_width = SVGLength::From(propertyValue);
    } else if (propertyName == "height") {
      m_height = SVGLength::From(propertyValue);
    } else if (propertyName == "patternUnits") {
      m_patternUnits = Utils::JSValueAsBrushUnits(propertyValue);
    } else if (propertyName == "patternContentUnits") {
      m_patternContentUnits = Utils::JSValueAsBrushUnits(propertyValue, "userSpaceOnUse");
    } else if (propertyName == "patternTransform") {
      m_transformSet = true;
      m_transform = Utils::JSValueAsTransform(propertyValue);

      if (propertyValue.IsNull()) {
        m_transformSet = false;
      }
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
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);

  SaveDefinition();

  if (auto const &root{SvgRoot()}) {
    root.Invalidate();
  }
}

void PatternView::UpdateBounds() {
  if (m_patternUnits == "objectBoundingBox") {
    com_ptr<ID2D1ImageBrush> brush;
    copy_to_abi(m_brush, *brush.put_void());

    D2D1_RECT_F rect{GetAdjustedRect(m_bounds)};
    brush->SetSourceRectangle(&rect);
  }
}

void PatternView::CreateBrush() {
  auto const root{SvgRoot()};

  D2D1_RECT_F elRect{GetAdjustedRect({0, 0, static_cast<float>(root.ActualWidth()), static_cast<float>(root.ActualHeight())})};
  CreateBrush(elRect);
}

void PatternView::CreateBrush(D2D1_RECT_F rect) {
  auto const &root{SvgRoot()};

  com_ptr<ID2D1Device> device;
  copy_to_abi(root.Device(), *device.put_void());

  if (auto const &cmdList{GetCommandList(device.get(), rect)}) {
    D2D1_IMAGE_BRUSH_PROPERTIES brushProperties{D2D1::ImageBrushProperties(rect)};
    brushProperties.extendModeX = D2D1_EXTEND_MODE_WRAP;
    brushProperties.extendModeY = D2D1_EXTEND_MODE_WRAP;

    com_ptr<ID2D1DeviceContext> deviceContext;
    copy_to_abi(root.DeviceContext(), *deviceContext.put_void());

    //cmdList->Close();

    //com_ptr<ID2D1CommandSink> sink;

    com_ptr<ID2D1ImageBrush> imageBrush;
    check_hresult(deviceContext->CreateImageBrush(cmdList.get(), brushProperties, imageBrush.put()));

    //cmdList->Close();

    copy_from_abi(m_brush, imageBrush.get());
  }
}

D2D1_RECT_F PatternView::GetAdjustedRect(D2D1_RECT_F bounds) {
  float width{bounds.right - bounds.left};
  float height{bounds.bottom - bounds.top};

  float x{Utils::GetAbsoluteLength(m_x, width) + bounds.left};
  float y{Utils::GetAbsoluteLength(m_y, height) + bounds.top};
  float adjWidth{Utils::GetAbsoluteLength(m_width, width)};
  float adjHeight{Utils::GetAbsoluteLength(m_height, height)};

  return {x, y, adjWidth, adjHeight};
}

com_ptr<ID2D1CommandList> PatternView::GetCommandList(ID2D1Device* device, D2D1_RECT_F rect) {
  com_ptr<ID2D1DeviceContext> deviceContext;
  check_hresult(device->CreateDeviceContext(D2D1_DEVICE_CONTEXT_OPTIONS_NONE, deviceContext.put()));

  com_ptr<ID2D1CommandList> cmdList;
  check_hresult(deviceContext->CreateCommandList(cmdList.put()));

  deviceContext->SetTarget(cmdList.get());

  //auto const &cmdList{winrt::Microsoft::Graphics::Canvas::CanvasCommandList(canvas)};
  //auto const &session{cmdList.CreateDrawingSession()};

  deviceContext->BeginDraw();
  deviceContext->Clear(D2D1::ColorF(D2D1::ColorF::Orange, 0.0f));

  if (m_align != "") {
    Rect vbRect{
        m_minX,
        m_minY,
        (m_vbWidth + m_minX),
        (m_vbHeight + m_minY)};

    auto originalTransform{D2DHelpers::GetTransform(deviceContext.get())};

    auto transform{Utils::GetViewBoxTransform(
        vbRect,
        {
            rect.left,
            rect.top,
            rect.left+rect.right,
            rect.top+rect.bottom
        },
        m_align,
        m_meetOrSlice)};

    if (m_transformSet) {
      transform = transform * m_transform;
    }

    //deviceContext->SetTransform(D2DHelpers::AsD2DTransform(transform));
    deviceContext->SetTransform(originalTransform * D2DHelpers::AsD2DTransform(transform));
    //session.Transform(transform);
  }

  auto root{SvgRoot()};
  Size size{static_cast<float>(root.ActualWidth()), static_cast<float>(root.ActualHeight())};

  for (auto const &child : Children()) {
    IInspectable asInspectable;
    copy_from_abi(asInspectable, deviceContext.get());

    // child geometry size??
    child.Draw(asInspectable, size);
  }

  cmdList->Close();

  //session.Close();
  deviceContext->EndDraw();

  // TODO: Fix after Geometry switch
  return cmdList;
}



} // namespace winrt::RNSVG::implementation
