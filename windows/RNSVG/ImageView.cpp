#include "pch.h"
#include "ImageView.h"
#include "ImageView.g.cpp"

#include <winrt/Windows.Security.Cryptography.h>
#include <winrt/Windows.Storage.Streams.h>
#include <winrt/Windows.Web.Http.Headers.h>
#include <winrt/Windows.Web.Http.h>

#include "Utils.h"

#include <d2d1effects.h>
#include <shcore.h>
#include <wincodec.h>

using namespace winrt::Microsoft::ReactNative;
using namespace winrt::Windows::Security::Cryptography;
using namespace winrt::Windows::Storage::Streams;
using namespace winrt::Windows::Web::Http;

namespace winrt::RNSVG::implementation {
void ImageView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "src") {
      auto const &src{propertyValue.AsObject()};

      for (auto const &item : src) {
        auto const &key{item.first};
        auto const &value{item.second};

        if (key == "uri") {
          m_source.uri = to_hstring(Utils::JSValueAsString(value));
          m_source.type = ImageSourceType::Uri;
          m_source.format = ImageSourceFormat::Bitmap;
          m_source.width = 0;
          m_source.height = 0;

          if (SvgParent()) {
            LoadImageSourceAsync(true);
          }
        } else if (key == "width") {
          m_source.width = Utils::JSValueAsFloat(value);
        } else if (key == "height") {
          m_source.height = Utils::JSValueAsFloat(value);
        } else if (key == "scale") {
          m_source.scale = Utils::JSValueAsFloat(value);
        } else if (key == "method") {
          m_source.method = to_hstring(Utils::JSValueAsString(value));
        } else if (key == "headers") {
          m_source.headers.clear();
          for (auto const &header : value.AsObject()) {
            m_source.headers.push_back(std::make_pair(to_hstring(header.first), to_hstring(Utils::JSValueAsString(header.second))));
          }
        } else if (key == "__packager_asset") {
          m_source.packagerAsset = value.AsBoolean();
        }
      }
    } else if (propertyName == "x") {
      m_x = SVGLength::From(propertyValue);
    } else if (propertyName == "y") {
      m_y = SVGLength::From(propertyValue);
    } else if (propertyName == "width") {
      m_width = SVGLength::From(propertyValue);
    } else if (propertyName == "height") {
      m_height = SVGLength::From(propertyValue);
    } else if (propertyName == "align") {
      m_align = Utils::JSValueAsString(propertyValue);
    } else if (propertyName == "meetOrSlice") {
      m_meetOrSlice = Utils::GetMeetOrSlice(propertyValue);
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}

void ImageView::Draw(RNSVG::D2DDeviceContext const &context, Size const &size) {
  if (!m_wicbitmap) {
    return;
  }

  com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(context)->Get()};

  uint32_t imgWidth, imgHeight;
  check_hresult(m_wicbitmap->GetSize(&imgWidth, &imgHeight));

  m_source.width = static_cast<float>(imgWidth);
  m_source.height = static_cast<float>(imgHeight);

  com_ptr<ID2D1Bitmap1> bitmap;
  check_hresult(deviceContext->CreateBitmapFromWicBitmap(m_wicbitmap.get(), nullptr, bitmap.put()));

  if (m_source.width == 0 || m_source.height == 0) {
    m_source.width = size.Width;
    m_source.height = size.Height;
  }

  float x{Utils::GetAbsoluteLength(m_x, size.Width)};
  float y{Utils::GetAbsoluteLength(m_y, size.Height)};
  float width{Utils::GetAbsoluteLength(m_width, size.Width)};
  float height{Utils::GetAbsoluteLength(m_height, size.Height)};

  if (width == 0) {
    width = m_source.width * m_source.scale;
  }

  if (height == 0) {
    height = m_source.height * m_source.scale;
  }

  com_ptr<ID2D1Geometry> clipPathGeometry;
  if (ClipPathGeometry()) {
    clipPathGeometry = get_self<D2DGeometry>(ClipPathGeometry())->Get();
  }

  D2DHelpers::PushOpacityLayer(deviceContext.get(), clipPathGeometry.get(), m_opacity);

  if (m_source.format == ImageSourceFormat::Bitmap) {
    D2D1_MATRIX_3X2_F transform{D2DHelpers::GetTransform(deviceContext.get())};

    if (m_propSetMap[RNSVG::BaseProp::Matrix]) {
      deviceContext->SetTransform(transform * D2DHelpers::AsD2DTransform(SvgTransform()));
    }

    if (m_align != "") {
      com_ptr<ID2D1Effect> bitmapEffects;
      check_hresult(deviceContext->CreateEffect(CLSID_D2D1BitmapSource, bitmapEffects.put()));
      check_hresult(bitmapEffects->SetValue(D2D1_BITMAPSOURCE_PROP_WIC_BITMAP_SOURCE, m_wicbitmap.get()));

      com_ptr<ID2D1Effect> transformEffect;
      Rect elRect{x, y, width, height};
      Rect vbRect{0, 0, m_source.width, m_source.height};
      deviceContext->CreateEffect(CLSID_D2D12DAffineTransform, transformEffect.put());
      transformEffect->SetValue(
          D2D1_2DAFFINETRANSFORM_PROP_TRANSFORM_MATRIX,
          Utils::GetViewBoxTransform(vbRect, elRect, m_align, m_meetOrSlice));
      transformEffect->SetInputEffect(0, bitmapEffects.get());

      com_ptr<ID2D1Effect> cropEffect;
      deviceContext->CreateEffect(CLSID_D2D1Crop, cropEffect.put());
      cropEffect->SetValue(D2D1_CROP_PROP_RECT, D2D1::RectF(x, y, width, height));
      cropEffect->SetInputEffect(0, transformEffect.get());

      deviceContext->DrawImage(cropEffect.get());
    } else {
      deviceContext->DrawBitmap(bitmap.get());
    }

    deviceContext->SetTransform(transform);
  }

  deviceContext->PopLayer();
}

void ImageView::CreateResources() {
  LoadImageSourceAsync(true);
}

void ImageView::Unload() {
  if (m_wicbitmap) {
    m_wicbitmap = nullptr;
  }
}

IAsyncAction ImageView::LoadImageSourceAsync(bool invalidate) {
  Uri uri{m_source.uri};
  hstring scheme{uri ? uri.SchemeName() : L""};
  hstring ext{uri ? uri.Extension() : L""};

  if (ext == L".svg" || ext == L".svgz") {
    m_source.format = ImageSourceFormat::Svg;
    co_return;
  }

  if (scheme == L"http" || scheme == L"https") {
    m_source.type = ImageSourceType::Download;
  } else if (scheme == L"data") {
    m_source.type = ImageSourceType::InlineData;
    if (to_string(m_source.uri).find("image/svg+xml") != std::string::npos) {
      m_source.format = ImageSourceFormat::Svg;
      co_return;
    }
  }

  const bool fromStream{m_source.type == ImageSourceType::Download || m_source.type == ImageSourceType::InlineData};

  InMemoryRandomAccessStream stream{nullptr};

  // get weak reference before any co_await calls
  auto weak_this{get_weak()};

  try {
    stream = co_await GetImageMemoryStreamAsync(m_source);

    if (fromStream && !stream) {
      co_return;
    }
  } catch (winrt::hresult_error const &) {
    co_return;
  }

  if (stream) {
    generateBitmap(stream);
  }

  if (invalidate) {
    if (auto strong_this{weak_this.get()}) {
      strong_this->SvgRoot().Invalidate();
    }
  }
}

IAsyncOperation<InMemoryRandomAccessStream> ImageView::GetImageMemoryStreamAsync(
    ImageSource source) {
  switch (source.type) {
    case ImageSourceType::Download:
      co_return co_await GetImageStreamAsync(source);
    case ImageSourceType::InlineData:
      co_return co_await GetImageInlineDataAsync(source);
    default: // ImageSourceType::Uri
      co_return nullptr;
  }
}

IAsyncOperation<InMemoryRandomAccessStream> ImageView::GetImageStreamAsync(
    ImageSource source) {
  try {
    co_await resume_background();

    auto httpMethod{source.method.empty() ? HttpMethod::Get() : HttpMethod{source.method}};

    Uri uri{source.uri};
    HttpRequestMessage request{httpMethod, uri};

    if (!source.headers.empty()) {
      for (auto const &header : source.headers) {
        if (_stricmp(to_string(header.first).c_str(), "authorization") == 0) {
          request.Headers().TryAppendWithoutValidation(header.first, header.second);
        } else {
          request.Headers().Append(header.first, header.second);
        }
      }
    }

    HttpClient httpClient;
    HttpResponseMessage response{co_await httpClient.SendRequestAsync(request)};

    if (response && response.StatusCode() == HttpStatusCode::Ok) {
      IInputStream inputStream{co_await response.Content().ReadAsInputStreamAsync()};
      InMemoryRandomAccessStream memoryStream;
      co_await RandomAccessStream::CopyAsync(inputStream, memoryStream);
      memoryStream.Seek(0);

      co_return memoryStream;
    }
  } catch (hresult_error const &) {
  }

  co_return nullptr;
}

IAsyncOperation<InMemoryRandomAccessStream> ImageView::GetImageInlineDataAsync(
    ImageSource source) {
  std::string uri{to_string(source.uri)};

  size_t start = uri.find(',');
  if (start == std::string::npos || start + 1 > uri.length()) {
    co_return nullptr;
  }

  try {
    co_await winrt::resume_background();

    std::string_view base64String{uri.c_str() + start + 1, uri.length() - start - 1};
    auto const &buffer{CryptographicBuffer::DecodeFromBase64String(to_hstring(base64String))};

    InMemoryRandomAccessStream memoryStream;
    co_await memoryStream.WriteAsync(buffer);
    memoryStream.Seek(0);

    co_return memoryStream;
  } catch (hresult_error const &) {
    // Base64 decode failed
  }

  co_return nullptr;
}

com_ptr<IWICBitmapSource> ImageView::wicBitmapSourceFromStream(InMemoryRandomAccessStream const &results) {
  if (!results) {
    return nullptr;
  }

  com_ptr<IWICImagingFactory> imagingFactory;
  check_hresult(CoCreateInstance(CLSID_WICImagingFactory, nullptr, CLSCTX_INPROC_SERVER, IID_PPV_ARGS(imagingFactory.put())));

  com_ptr<IStream> istream;
  check_hresult(CreateStreamOverRandomAccessStream(results.as<::IUnknown>().get(), __uuidof(IStream), istream.put_void()));

  com_ptr<IWICBitmapDecoder> bitmapDecoder;
  if (imagingFactory->CreateDecoderFromStream(
          istream.get(), nullptr, WICDecodeMetadataCacheOnDemand, bitmapDecoder.put()) < 0) {
    return nullptr;
  }

  com_ptr<IWICBitmapFrameDecode> decodedFrame;
  check_hresult(bitmapDecoder->GetFrame(0, decodedFrame.put()));
  return decodedFrame;
}

void ImageView::generateBitmap(InMemoryRandomAccessStream const &results) {
  com_ptr<IWICBitmapSource> decodedFrame = wicBitmapSourceFromStream(results);

  if (!decodedFrame) {
    return;
  }

  com_ptr<IWICImagingFactory> imagingFactory;
  check_hresult(
      CoCreateInstance(CLSID_WICImagingFactory, nullptr, CLSCTX_INPROC_SERVER, IID_PPV_ARGS(imagingFactory.put())));
  com_ptr<IWICFormatConverter> converter;
  check_hresult(imagingFactory->CreateFormatConverter(converter.put()));

  check_hresult(converter->Initialize(
      decodedFrame.get(),
      GUID_WICPixelFormat32bppPBGRA,
      WICBitmapDitherTypeNone,
      nullptr,
      0.0f,
      WICBitmapPaletteTypeMedianCut));

  check_hresult(
      imagingFactory->CreateBitmapFromSource(converter.get(), WICBitmapCacheOnLoad, m_wicbitmap.put()));
}
} // namespace winrt::RNSVG::implementation
