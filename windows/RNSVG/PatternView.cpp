#include "pch.h"
#include "PatternView.h"
#include "PatternView.g.cpp"

#include "Utils.h"
#include "D2DDevice.h"

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
      m_transform = Utils::JSValueAsD2DTransform(propertyValue);

      if (propertyValue.IsNull()) {
        m_transform = D2D1::Matrix3x2F::Identity();
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
    com_ptr<ID2D1ImageBrush> brush{get_self<D2DBrush>(m_brush)->Get().as<ID2D1ImageBrush>()};

    D2D1_RECT_F rect{GetAdjustedRect(m_bounds)};
    CreateBrush(rect);
  }
}

void PatternView::CreateBrush() {
  auto const root{SvgRoot()};

  D2D1_RECT_F elRect{GetAdjustedRect({0, 0, static_cast<float>(root.ActualWidth()), static_cast<float>(root.ActualHeight())})};
  CreateBrush(elRect);
}

void PatternView::CreateBrush(D2D1_RECT_F rect) {
  auto const &root{SvgRoot()};

  com_ptr<ID2D1Device> device{get_self<D2DDevice>(root.Device())->Get()};

  if (auto const &cmdList{GetCommandList(device.get(), rect)}) {
    D2D1_IMAGE_BRUSH_PROPERTIES brushProperties{D2D1::ImageBrushProperties(rect)};
    brushProperties.extendModeX = D2D1_EXTEND_MODE_WRAP;
    brushProperties.extendModeY = D2D1_EXTEND_MODE_WRAP;

    com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(root.DeviceContext())->Get()};

    com_ptr<ID2D1ImageBrush> imageBrush;
    check_hresult(deviceContext->CreateImageBrush(cmdList.get(), brushProperties, imageBrush.put()));

    auto transform{D2D1::Matrix3x2F::Translation({rect.left, rect.top}) * m_transform};
    imageBrush->SetTransform(transform);

    m_brush = make<RNSVG::implementation::D2DBrush>(imageBrush.as<ID2D1Brush>());
  }
}

D2D1_RECT_F PatternView::GetAdjustedRect(D2D1_RECT_F bounds) {
  float width{D2DHelpers::WidthFromD2DRect(bounds)};
  float height{D2DHelpers::HeightFromD2DRect(bounds)};

  float x{Utils::GetAbsoluteLength(m_x, width) + bounds.left};
  float y{Utils::GetAbsoluteLength(m_y, height) + bounds.top};
  float adjWidth{Utils::GetAbsoluteLength(m_width, width)};
  float adjHeight{Utils::GetAbsoluteLength(m_height, height)};

  return {x, y, adjWidth + x, adjHeight + y};
}

com_ptr<ID2D1CommandList> PatternView::GetCommandList(ID2D1Device* device, D2D1_RECT_F rect) {
  com_ptr<ID2D1DeviceContext> deviceContext;
  check_hresult(device->CreateDeviceContext(D2D1_DEVICE_CONTEXT_OPTIONS_NONE, deviceContext.put()));

  com_ptr<ID2D1CommandList> cmdList;
  check_hresult(deviceContext->CreateCommandList(cmdList.put()));

  deviceContext->SetTarget(cmdList.get());

  deviceContext->BeginDraw();
  deviceContext->Clear(D2D1::ColorF(D2D1::ColorF::Black, 0.0f));

  auto transform{D2D1::Matrix3x2F::Identity()};

  if (m_align != "") {
    Rect vbRect{
        m_minX,
        m_minY,
        (m_vbWidth + m_minX),
        (m_vbHeight + m_minY)};

    auto viewboxTransform{Utils::GetViewBoxTransform(
        vbRect,
        D2DHelpers::FromD2DRect(rect),
        m_align,
        m_meetOrSlice)};

    transform = D2DHelpers::AsD2DTransform(viewboxTransform) * transform;
  }

  deviceContext->SetTransform(transform);

  auto context = make<D2DDeviceContext>(deviceContext);
  for (auto const &child : Children()) {
    child.Draw(context, D2DHelpers::SizeFromD2DRect(rect));
  }

  cmdList->Close();

  deviceContext->EndDraw();

  return cmdList;
}



} // namespace winrt::RNSVG::implementation
