#include "pch.h"
#include "TSpanView.h"
#if __has_include("TSpanView.g.cpp")
#include "TSpanView.g.cpp"
#endif

#include <codecvt>
#include <string>

#include "Utils.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
namespace {

std::wstring TrimFontFamilyName(std::wstring value) {
  auto const isTrim = [](wchar_t ch) { return ch == L' ' || ch == L'\t' || ch == L'"' || ch == L'\''; };
  while (!value.empty() && isTrim(value.front())) {
    value.erase(value.begin());
  }
  while (!value.empty() && isTrim(value.back())) {
    value.pop_back();
  }
  return value;
}

hstring SelectAvailableFontFamily(IDWriteFactory *factory, hstring const &fontFamily) {
  com_ptr<IDWriteFontCollection> collection;
  if (FAILED(factory->GetSystemFontCollection(collection.put())) || !collection) {
    return fontFamily;
  }

  std::wstring raw{fontFamily.c_str()};
  hstring firstFamily;
  size_t start = 0;
  while (start <= raw.size()) {
    size_t const comma = raw.find(L',', start);
    std::wstring part = TrimFontFamilyName(
        raw.substr(start, comma == std::wstring::npos ? std::wstring::npos : comma - start));
    if (!part.empty()) {
      if (firstFamily.empty()) {
        firstFamily = hstring{part};
      }
      UINT32 index = 0;
      BOOL exists = FALSE;
      if (SUCCEEDED(collection->FindFamilyName(part.c_str(), &index, &exists)) && exists) {
        return hstring{part};
      }
    }
    if (comma == std::wstring::npos) {
      break;
    }
    start = comma + 1;
  }
  return firstFamily.empty() ? fontFamily : firstFamily;
}

} // namespace

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
  hstring const resolvedFamily{SelectAvailableFontFamily(dwriteFactory.get(), FontFamily())};
  check_hresult(dwriteFactory->CreateTextFormat(
      resolvedFamily.c_str(),
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
