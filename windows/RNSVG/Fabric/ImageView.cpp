#include "pch.h"
#include "ImageView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(ImageSource)
struct ImageSource {
  REACT_FIELD(uri)
  std::wstring uri{};
  REACT_FIELD(width)
  float width{0.0f};
  REACT_FIELD(height)
  float height{0.0f};

  bool operator==(const ImageSource &rhs) const {
    return uri == rhs.uri && width == rhs.width && height == rhs.height;
  }

  bool operator!=(const ImageSource &rhs) const {
    return !(*this == rhs);
  }
};

REACT_STRUCT(ImageProps)
struct ImageProps : winrt::implements<ImageProps, winrt::Microsoft::ReactNative::IComponentProps> {
  ImageProps(const winrt::Microsoft::ReactNative::ViewProps &props, const winrt::Microsoft::ReactNative::IComponentProps& cloneFrom) REACT_SVG_RENDERABLE_COMMON_PROPS_INIT
  {
    REACT_BEGIN_SVG_RENDERABLE_COMMON_PROPS_CLONE(ImageProps)
      x = cloneFromProps->x;
      y = cloneFromProps->y;
      width = cloneFromProps->width;
      height = cloneFromProps->height;
      src = cloneFromProps->src;
      align = cloneFromProps->align;
      meetOrSlice = cloneFromProps->meetOrSlice;
    REACT_END_SVG_RENDERABLE_COMMON_PROPS_CLONE
  }

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
    winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
  }

  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(x)
  std::optional<D2D1_SVG_LENGTH> x;
  REACT_FIELD(y)
  std::optional<D2D1_SVG_LENGTH> y;
  REACT_FIELD(width)
  std::optional<D2D1_SVG_LENGTH> width;
  REACT_FIELD(height)
  std::optional<D2D1_SVG_LENGTH> height;
  REACT_FIELD(src)
  ImageSource src;
  REACT_FIELD(align)
  std::optional<std::string> align{""};
  REACT_FIELD(meetOrSlice)
  std::optional<MeetOrSlice> meetOrSlice;
};

struct ImageView : winrt::implements<ImageView, winrt::Windows::Foundation::IInspectable, RenderableView> {
 public:
  ImageView() = default;

  const wchar_t *GetSvgElementName() noexcept override {
    return L"image";
  }

  void UpdateProps(
      const winrt::Microsoft::ReactNative::ComponentView &view,
      const winrt::Microsoft::ReactNative::IComponentProps &newProps,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps) noexcept {
    RenderableView::UpdateProps(view, newProps, oldProps);

    auto props = newProps.as<ImageProps>();

    if (!props->align) {
      m_aspectAlign = AlignToAspectAlign(props->align.value());
    } else {
      m_aspectAlign = D2D1_SVG_ASPECT_ALIGN::D2D1_SVG_ASPECT_ALIGN_NONE;
    }
  }

  void OnRender(const SvgView &svgView, ID2D1SvgDocument &document, ID2D1SvgElement &element) noexcept override {
    auto props = m_props.as<ImageProps>();
    SetCommonSvgProps(svgView, document, element, *props);

    if (props->x) {
      element.SetAttributeValue(SvgStrings::xAttributeName, props->x.value());
    }
    if (props->y) {
      element.SetAttributeValue(SvgStrings::yAttributeName, props->y.value());
    }
    if (props->width) {
      element.SetAttributeValue(SvgStrings::widthAttributeName, props->width.value());
    }
    if (props->height) {
      element.SetAttributeValue(SvgStrings::heightAttributeName, props->height.value());
    }

    if (props->align != std::nullopt || props->meetOrSlice != std::nullopt) {
      D2D1_SVG_PRESERVE_ASPECT_RATIO preserveAspectRatio;
      preserveAspectRatio.defer = false;
      preserveAspectRatio.align = m_aspectAlign;

      preserveAspectRatio.meetOrSlice = props->meetOrSlice.value() == MeetOrSlice::Meet
          ? D2D1_SVG_ASPECT_SCALING::D2D1_SVG_ASPECT_SCALING_MEET
          : D2D1_SVG_ASPECT_SCALING::D2D1_SVG_ASPECT_SCALING_SLICE;
      element.SetAttributeValue(SvgStrings::preserveAspectRatioAttributeName, preserveAspectRatio);
    }

    if (!props->src.uri.empty()) {
      element.SetAttributeValue(
          SvgStrings::xlinkhrefAttributeName,
          D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
          props->src.uri.c_str());
    }
  }

 private:
  D2D1_SVG_ASPECT_ALIGN m_aspectAlign;
};

void RegisterImageComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::ImageProps, ImageView>(L"RNSVGImage", builder);
}

} // namespace winrt::RNSVG::implementation
