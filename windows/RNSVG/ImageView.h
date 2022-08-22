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
  void Render(
      Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &canvas,
      Microsoft::Graphics::Canvas::CanvasDrawingSession const &session);
  void CreateResources(
      Microsoft::Graphics::Canvas::ICanvasResourceCreator const &resourceCreator,
      Microsoft::Graphics::Canvas::UI::CanvasCreateResourcesEventArgs const &args);
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
  Microsoft::Graphics::Canvas::CanvasBitmap m_bitmap{nullptr};

  Windows::Foundation::IAsyncAction LoadImageSourceAsync(Microsoft::Graphics::Canvas::ICanvasResourceCreator resourceCreator, bool invalidate);
  winrt::Windows::Foundation::IAsyncOperation<winrt::Windows::Storage::Streams::InMemoryRandomAccessStream>
  GetImageMemoryStreamAsync(ImageSource source);
  Windows::Foundation::IAsyncOperation<winrt::Windows::Storage::Streams::InMemoryRandomAccessStream>
  GetImageStreamAsync(ImageSource source);
  Windows::Foundation::IAsyncOperation<winrt::Windows::Storage::Streams::InMemoryRandomAccessStream>
  GetImageInlineDataAsync(ImageSource source);
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct ImageView : ImageViewT<ImageView, implementation::ImageView> {};
} // namespace winrt::RNSVG::factory_implementation
