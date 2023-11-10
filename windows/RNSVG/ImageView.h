#pragma once
#include "ImageView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {
enum class ImageSourceType { Uri = 0, Download = 1, InlineData = 2 };
enum class ImageSourceFormat { Bitmap = 0, Svg = 1 };
struct ImageSource {
  hstring uri{L""};
  hstring method{L""};
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

  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
  void Draw(RNSVG::D2DDeviceContext const &deviceContext, Windows::Foundation::Size const &size);
  void CreateResources();
  void Unload();

 private:
  RNSVG::SVGLength m_x{};
  RNSVG::SVGLength m_y{};
  RNSVG::SVGLength m_width{};
  RNSVG::SVGLength m_height{};

  // preserveAspectRatio
  std::string m_align{""};
  RNSVG::MeetOrSlice m_meetOrSlice{RNSVG::MeetOrSlice::Meet};

  ImageSource m_source{};
  com_ptr<IWICBitmap> m_wicbitmap;

  Windows::Foundation::IAsyncAction LoadImageSourceAsync(bool invalidate);
  Windows::Foundation::IAsyncOperation<Windows::Storage::Streams::InMemoryRandomAccessStream>
  GetImageMemoryStreamAsync(ImageSource source);
  Windows::Foundation::IAsyncOperation<Windows::Storage::Streams::InMemoryRandomAccessStream>
  GetImageStreamAsync(ImageSource source);
  Windows::Foundation::IAsyncOperation<Windows::Storage::Streams::InMemoryRandomAccessStream>
  GetImageInlineDataAsync(ImageSource source);
  com_ptr<IWICBitmapSource> ImageView::wicBitmapSourceFromStream(
      Windows::Storage::Streams::InMemoryRandomAccessStream const &stream);
  void generateBitmap(
      Windows::Storage::Streams::InMemoryRandomAccessStream const &results);
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct ImageView : ImageViewT<ImageView, implementation::ImageView> {};
} // namespace winrt::RNSVG::factory_implementation
