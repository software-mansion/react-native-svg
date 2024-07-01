#include "pch.h"
#include "TSpanView.h"
#if __has_include("TSpanView.g.cpp")
#include "TSpanView.g.cpp"
#endif

#include <codecvt>

#include "Utils.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
TSpanProps::TSpanProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void TSpanProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

TSpanView::TSpanView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) : base_type(args) {}

void TSpanView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  builder.AddViewComponent(
      L"RNSVGTSpan", [](winrt::Microsoft::ReactNative::IReactViewComponentBuilder const &builder) noexcept {
        builder.SetCreateProps([](winrt::Microsoft::ReactNative::ViewProps props) noexcept {
          return winrt::make<winrt::RNSVG::implementation::TSpanProps>(props);
        });
        builder.SetCreateComponentView([](const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) noexcept {
          return winrt::make<winrt::RNSVG::implementation::TSpanView>(args);
        });
      });
}

void TSpanView::UpdateProperties(
    const winrt::Microsoft::ReactNative::IComponentProps &props,
    const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
    bool forceUpdate,
    bool invalidate) noexcept {
  auto tspanProps = props.try_as<TSpanProps>();
  if (tspanProps) {
    m_props = tspanProps;
    m_content = m_props->content;
  }

  base_type::UpdateProperties(props, oldProps, forceUpdate, invalidate);
}
#else
void TSpanView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "content") {
      m_content = propertyValue.AsString();
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}
#endif

void TSpanView::Draw(RNSVG::D2DDeviceContext const &context, Size const &size) {
  com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(context)->Get()};

  D2D1_MATRIX_3X2_F transform{D2DHelpers::GetTransform(deviceContext.get())};

  bool translateXY{X().Size() > 0 || Y().Size() > 0};

  if (translateXY) {
    float x{X().Size() > 0 ? X().GetAt(0).Value : 0};
    float y{Y().Size() > 0 ? Y().GetAt(0).Value : 0};

    deviceContext->SetTransform(D2D1::Matrix3x2F::Translation({x, y}) * transform);
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
      D2DHelpers::FontWeightFrom(SvgParent(), FontWeight()),
      DWRITE_FONT_STYLE_NORMAL,
      DWRITE_FONT_STRETCH_NORMAL,
      FontSize(),
      L"",
      textFormat.put()));

  auto const fill{Utils::GetCanvasBrush(FillBrushId(), Fill(), SvgRoot(), nullptr, context)};

  deviceContext->DrawText(
      to_hstring(m_content).c_str(),
      static_cast<uint32_t>(m_content.size()),
      textFormat.get(),
      D2D1::RectF(0, 0, size.Width, size.Height),
      fill.get());

  if (translateXY) {
    deviceContext->SetTransform(transform);
  }
}
} // namespace winrt::RNSVG::implementation
