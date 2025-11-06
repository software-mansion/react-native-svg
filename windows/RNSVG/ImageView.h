#pragma once

#include "ImageView.g.h"
#include "RenderableView.h"

#include <wincodec.h>

namespace winrt::RNSVG::implementation {
enum class ImageSourceType { Uri = 0, Download = 1, InlineData = 2 };
enum class ImageSourceFormat { Bitmap = 0, Svg = 1 };

struct ImageSource {
  std::string uri{""};
  std::string method{""};
  std::vector<std::pair<hstring, hstring>> headers{};
  float width{0.0f};
  float height{0.0f};
  float scale{1.0f};
  bool packagerAsset{false};
  ImageSourceType type{ImageSourceType::Uri};
  ImageSourceFormat format{ImageSourceFormat::Bitmap};
};

struct ImageView : ImageViewT<ImageView, RNSVG::implementation::RenderableView> {
 public:
  ImageView() = default;

  // IRenderablePaper
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);

  // IRenderable
  void Draw(RNSVG::D2DDeviceContext const &deviceContext, Windows::Foundation::Size const &size);
  void CreateResources();
  void Unload();

 private:
  RNSVG::SVGLength m_x{};
  RNSVG::SVGLength m_y{};
  RNSVG::SVGLength m_width{};
  RNSVG::SVGLength m_height{};
  ImageSource m_source{};
  ImageSourceType m_type{ImageSourceType::Uri};
  ImageSourceFormat m_format{ImageSourceFormat::Bitmap};

  // preserveAspectRatio
  std::string m_align{""};
  RNSVG::MeetOrSlice m_meetOrSlice{RNSVG::MeetOrSlice::Meet};

  com_ptr<IWICBitmap> m_wicbitmap;

  Windows::Foundation::IAsyncAction LoadImageSourceAsync(bool invalidate);
  Windows::Foundation::IAsyncOperation<Windows::Storage::Streams::InMemoryRandomAccessStream>
  GetImageMemoryStreamAsync(ImageSource source);
  Windows::Foundation::IAsyncOperation<Windows::Storage::Streams::InMemoryRandomAccessStream>
  GetImageStreamAsync(ImageSource source);
  Windows::Foundation::IAsyncOperation<Windows::Storage::Streams::InMemoryRandomAccessStream>
  GetImageInlineDataAsync(ImageSource source);
  com_ptr<IWICBitmapSource> wicBitmapSourceFromStream(
      Windows::Storage::Streams::InMemoryRandomAccessStream const &stream);
  void generateBitmap(
      Windows::Storage::Streams::InMemoryRandomAccessStream const &results);
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct ImageView : ImageViewT<ImageView, implementation::ImageView> {};
} // namespace winrt::RNSVG::factory_implementation
