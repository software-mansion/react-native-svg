#pragma once

#include "ImageProps.g.h"
#include "ImageView.g.h"
#include "RenderableView.h"

#include <wincodec.h>

namespace winrt::RNSVG::implementation {
enum class ImageSourceType { Uri = 0, Download = 1, InlineData = 2 };
enum class ImageSourceFormat { Bitmap = 0, Svg = 1 };

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

struct ImageView : ImageViewT<ImageView, RNSVG::implementation::RenderableView> {
 public:
  ImageView() = default;

  const wchar_t *GetSvgElementName() noexcept override;
  bool IsSupported() const noexcept override;

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;
};
} // namespace winrt::RNSVG::implementation
