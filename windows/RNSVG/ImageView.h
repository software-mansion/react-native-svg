#pragma once

#ifdef USE_FABRIC
#include "ImageProps.g.h"
#endif

#include "ImageView.g.h"
#include "RenderableView.h"

#include <wincodec.h>

namespace winrt::RNSVG::implementation {
enum class ImageSourceType { Uri = 0, Download = 1, InlineData = 2 };
enum class ImageSourceFormat { Bitmap = 0, Svg = 1 };

#ifdef USE_FABRIC
REACT_STRUCT(ImageSource)
struct ImageSource {
  REACT_FIELD(uri)
  std::string uri{""};
  REACT_FIELD(method)
  std::string method{""};
  //REACT_FIELD(headers)
  //std::vector<winrt::Microsoft::ReactNative::JSValue> headers;
  REACT_FIELD(body)
  std::string body{""};
  REACT_FIELD(width)
  float width{0.0f};
  REACT_FIELD(height)
  float height{0.0f};
  REACT_FIELD(scale)
  float scale{1.0f};
  /*REACT_FIELD(packagerAsset)
  bool packagerAsset{false};
  REACT_FIELD(type)
  ImageSourceType type{ImageSourceType::Uri};
  REACT_FIELD(format)
  ImageSourceFormat format{ImageSourceFormat::Bitmap};*/

  bool operator==(const ImageSource &rhs) const {
    return uri == rhs.uri && method == rhs.method && width == rhs.width && height == rhs.height && scale == rhs.scale;
  }

  bool operator!=(const ImageSource &rhs) const {
    return !(*this == rhs);
  }
};

REACT_STRUCT(ImageProps)
struct ImageProps : ImagePropsT<ImageProps, SvgRenderableCommonProps> {
  ImageProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(x)
  RNSVG::SVGLength x{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(y)
  RNSVG::SVGLength y{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(width)
  RNSVG::SVGLength width{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(height)
  RNSVG::SVGLength height{0, winrt::RNSVG::LengthType::Unknown};
  REACT_FIELD(src)
  ImageSource src;
  REACT_FIELD(align)
  std::string align{""};
  REACT_FIELD(meetOrSlice)
  RNSVG::MeetOrSlice meetOrSlice{RNSVG::MeetOrSlice::Meet};
};
#else
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
#endif

struct ImageView : ImageViewT<ImageView, RNSVG::implementation::RenderableView> {
 public:
  ImageView() = default;

#ifdef USE_FABRIC
  ImageView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args);

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;

  // IRenderableFabric
  void UpdateProperties(
      const winrt::Microsoft::ReactNative::IComponentProps &props,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
      bool forceUpdate = true,
      bool invalidate = true) noexcept override;
#else
  // IRenderablePaper
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
#endif

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

#ifdef USE_FABRIC
  com_ptr<ImageProps> m_props;
#endif

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
