#include "pch.h"
#include "ImageView.h"
#include "ImageView.g.cpp"

#include <winrt/Microsoft.Graphics.Canvas.Effects.h>
#include <winrt/Windows.Security.Cryptography.h>
#include <winrt/Windows.Storage.Streams.h>
#include <winrt/Windows.Web.Http.Headers.h>
#include <winrt/Windows.Web.Http.h>

#include "Utils.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;
using namespace Windows::Security::Cryptography;
using namespace Windows::Storage::Streams;
using namespace Windows::Web::Http;

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
            LoadImageSourceAsync(SvgRoot().Canvas(), true);
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

void ImageView::Render(UI::Xaml::CanvasControl const &canvas, CanvasDrawingSession const &session) {
  if (m_source.width == 0 || m_source.height == 0) {
    m_source.width = canvas.Size().Width;
    m_source.height = canvas.Size().Height;
  }

  float x{Utils::GetAbsoluteLength(m_x, canvas.Size().Width)};
  float y{Utils::GetAbsoluteLength(m_y, canvas.Size().Height)};
  float width{Utils::GetAbsoluteLength(m_width, canvas.Size().Width)};
  float height{Utils::GetAbsoluteLength(m_height, canvas.Size().Height)};

  if (width == 0) {
    width = m_source.width * m_source.scale;
  }

  if (height == 0) {
    height = m_source.height * m_source.scale;
  }

  Effects::Transform2DEffect transformEffect{nullptr};
  if (m_align != "") {
    Rect elRect{x, y, width, height};
    Rect vbRect{0, 0, m_source.width, m_source.height};
    transformEffect = Effects::Transform2DEffect{};
    transformEffect.TransformMatrix(Utils::GetViewBoxTransform(vbRect, elRect, m_align, m_meetOrSlice));
  }

  auto const &clipPathGeometry{ClipPathGeometry()};

  if (auto const &opacityLayer{clipPathGeometry ? session.CreateLayer(m_opacity, clipPathGeometry) : session.CreateLayer(m_opacity)}) {
    if (m_source.format == ImageSourceFormat::Bitmap && m_bitmap) {
      auto const &transform{session.Transform()};
      if (m_propSetMap[RNSVG::BaseProp::Matrix]) {
        session.Transform(SvgTransform());
      }

      if (m_align != "" && transformEffect) {
        transformEffect.Source(m_bitmap);
        Effects::CropEffect cropEffect{};
        cropEffect.SourceRectangle({x, y, width, height});
        cropEffect.Source(transformEffect);
        session.DrawImage(cropEffect);
      } else {
        session.DrawImage(m_bitmap, {x, y, width, height});
      }

      session.Transform(transform);
    }

    opacityLayer.Close();
  }
}

void ImageView::CreateResources(ICanvasResourceCreator const &resourceCreator, UI::CanvasCreateResourcesEventArgs const &args) {
  args.TrackAsyncAction(LoadImageSourceAsync(resourceCreator, false));
}

void ImageView::Unload() {
  if (m_bitmap) {
    m_bitmap.Close();
    m_bitmap = nullptr;
  }
}

IAsyncAction ImageView::LoadImageSourceAsync(ICanvasResourceCreator resourceCreator, bool invalidate) {
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
    m_bitmap = co_await CanvasBitmap::LoadAsync(resourceCreator, stream);
  } else {
    m_bitmap = co_await CanvasBitmap::LoadAsync(resourceCreator, uri);
  }

  m_source.width = m_bitmap.Size().Width;
  m_source.height = m_bitmap.Size().Height;

  if (invalidate) {
    if (auto strong_this{weak_this.get()}) {
      strong_this->SvgRoot().InvalidateCanvas();
    }
  }
}

IAsyncOperation<InMemoryRandomAccessStream> ImageView::GetImageMemoryStreamAsync(ImageSource source) {
  switch (source.type) {
    case ImageSourceType::Download:
      co_return co_await GetImageStreamAsync(source);
    case ImageSourceType::InlineData:
      co_return co_await GetImageInlineDataAsync(source);
    default: // ImageSourceType::Uri
      co_return nullptr;
  }
}

IAsyncOperation<InMemoryRandomAccessStream> ImageView::GetImageStreamAsync(ImageSource source) {
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

IAsyncOperation<InMemoryRandomAccessStream> ImageView::GetImageInlineDataAsync(ImageSource source) {
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
  } catch (winrt::hresult_error const &) {
    // Base64 decode failed
  }

  co_return nullptr;
}
} // namespace winrt::RNSVG::implementation
