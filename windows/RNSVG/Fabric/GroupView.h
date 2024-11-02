#pragma once
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(FontObject)
struct FontObject {
  REACT_FIELD(fontStyle)
  std::optional<std::string> fontStyle;
  REACT_FIELD(fontVariant)
  std::optional<std::string> fontVariant;
  REACT_FIELD(fontWeight)
  std::optional<std::string> fontWeight;
  REACT_FIELD(fontStretch)
  std::optional<std::string> fontStretch;
  REACT_FIELD(fontSize)
  std::optional<float> fontSize;
  REACT_FIELD(fontFamily)
  std::optional<std::string> fontFamily;
  REACT_FIELD(textAnchor)
  std::optional<std::string> textAnchor;
  REACT_FIELD(textDecoration)
  std::optional<std::string> textDecoration;
  REACT_FIELD(letterSpacing)
  std::optional<float> letterSpacing;
  REACT_FIELD(wordSpacing)
  std::optional<float> wordSpacing;
  REACT_FIELD(kerning)
  std::optional<float> kerning;
  REACT_FIELD(fontFeatureSettings)
  std::optional<std::string> fontFeatureSettings;
  REACT_FIELD(fontVariantLigatures)
  std::optional<std::string> fontVariantLigatures;
  REACT_FIELD(fontVariationSettings)
  std::optional<std::string> fontVariationSettings;

  bool operator==(const FontObject &rhs) const {
    return fontStyle == rhs.fontStyle && fontVariant == rhs.fontVariant &&
        fontWeight == rhs.fontWeight && fontStretch == rhs.fontStretch &&
        fontSize == rhs.fontSize && fontFamily == rhs.fontFamily &&
        textAnchor == rhs.textAnchor && textDecoration == rhs.textDecoration &&
        letterSpacing == rhs.letterSpacing && wordSpacing == rhs.wordSpacing &&
        kerning == rhs.kerning &&
        fontFeatureSettings == rhs.fontFeatureSettings &&
        fontVariantLigatures == rhs.fontVariantLigatures &&
        fontVariationSettings == rhs.fontVariationSettings;
  }

  bool operator!=(const FontObject &rhs) const {
    return !(*this == rhs);
  }
};

#define REACT_SVG_GROUP_COMMON_PROPS  \
  REACT_SVG_RENDERABLE_COMMON_PROPS \
  REACT_FIELD(fontSize)               \
  std::string fontSize; \
  REACT_FIELD(fontWeight)             \
  std::string fontWeight; \
  REACT_FIELD(font) \
  FontObject font; \

#define REACT_SVG_GROUP_COMMON_PROPS_INIT \
  : m_props(props) 



void RegisterGroupComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;


} // namespace winrt::RNSVG::implementation
