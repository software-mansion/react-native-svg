#include "pch.h"
#include "TSpanView.h"
#include "TSpanView.g.cpp"

#include <codecvt>

#include "Utils.h"

namespace winrt::RNSVG::implementation {
void TSpanView::UpdateProperties(
    Microsoft::ReactNative::IJSValueReader const &reader,
    bool forceUpdate,
    bool invalidate) {
  const Microsoft::ReactNative::JSValueObject &propertyMap{
      Microsoft::ReactNative::JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "content") {
      m_content = propertyValue.AsString();
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}

void TSpanView::Draw() {
  if (auto const &root{SvgRoot()}) {
    com_ptr<ID2D1DeviceContext1> deviceContext;
    copy_to_abi(root.DeviceContext(), *deviceContext.put_void());

    D2D1_MATRIX_3X2_F transform;
    deviceContext->GetTransform(&transform);

    bool translateXY{X().Size() > 0 || Y().Size() > 0};

    if (translateXY) {
      float x{X().Size() > 0 ? X().GetAt(0).Value() : 0};
      float y{Y().Size() > 0 ? Y().GetAt(0).Value() : 0};
      deviceContext->SetTransform(transform * D2DHelpers::AsD2DTransform(Numerics::make_float3x2_translation(x, y)));
    }

    com_ptr<ID2D1Factory> d2dFactory;
    deviceContext->GetFactory(d2dFactory.put());

    com_ptr<IDWriteFactory> dwriteFactory;
    check_hresult(DWriteCreateFactory(
        DWRITE_FACTORY_TYPE_SHARED,
        __uuidof(IDWriteFactory),
        reinterpret_cast<::IUnknown **>(dwriteFactory.put_void())));

    com_ptr<IDWriteTextFormat> textFormat;
    check_hresult(dwriteFactory->CreateTextFormat(
        FontFamily().c_str(),
        nullptr, // Font collection (nullptr sets it to use the system font collection).
        D2DHelpers::FontWeightFrom(FontWeight(), SvgParent()),
        DWRITE_FONT_STYLE_NORMAL,
        DWRITE_FONT_STRETCH_NORMAL,
        FontSize(),
        L"",
        textFormat.put()));

    auto const fill{Utils::GetCanvasBrush(FillBrushId(), Fill(), SvgRoot(), nullptr)};

    deviceContext->DrawText(
        to_hstring(m_content).c_str(),
        static_cast<uint32_t>(m_content.size()),
        textFormat.get(),
        D2D1::RectF(0, 0, static_cast<float>(root.ActualWidth()), static_cast<float>(root.ActualHeight())),
        fill.get());

    // com_ptr<IDWriteTextLayout> textLayout;
    // check_hresult(dwriteFactory->CreateTextLayout(
    //    to_hstring(m_content).c_str(),
    //    static_cast<uint32_t>(m_content.size()),
    //    textFormat.get(),
    //    static_cast<float>(canvas.Width()),
    //    static_cast<float>(canvas.Height()),
    //    textLayout.put()));

    // com_ptr<IDWriteTextRenderer> textRenderer;
    // textLayout->Draw(nullptr, textRenderer.get(), 0, 0);

    // ComPtr<CanvasGeometry> CanvasGeometry::CreateNew(ICanvasTextLayout * canvasTextLayout) {
    //  auto dwriteTextLayout = GetWrappedResource<IDWriteTextLayout2>(canvasTextLayout);

    //  ComPtr<ICanvasDevice> canvasDevice;
    //  ThrowIfFailed(canvasTextLayout->get_Device(&canvasDevice));

    //  GeometryDevicePtr device(canvasDevice.Get());

    //  auto outlineTextRenderer = Make<OutlineTextRenderer>(device);

    //  ThrowIfFailed(dwriteTextLayout->Draw(nullptr, outlineTextRenderer.Get(), 0, 0));

    //  auto d2dGeometry = outlineTextRenderer->CloseAndGetPath();

    //  auto outlineGeometry = Make<CanvasGeometry>(device, d2dGeometry.Get());

    //  return outlineGeometry;
    //}

    // fix point
    // deviceContext->DrawTextLayout({0, 0}, textLayout.get(), fill.get());

    // __super::Render(canvas, session);
    if (translateXY) {
      deviceContext->SetTransform(transform);
    }
  }
}
} // namespace winrt::RNSVG::implementation
