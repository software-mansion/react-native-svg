#include "RNSVGClipPathProps.h"
#include <react/renderer/core/RawProps.h>

namespace facebook::react {

static folly::dynamic readRawDynamic(const RawProps& rawProps, const char* name) {
  const auto* raw = rawProps.at(name, nullptr, nullptr);
  if (raw != nullptr) {
    return (folly::dynamic)(*raw);
  }
  return nullptr;
}

RNSVGClipPathProps::RNSVGClipPathProps()
    : RNSVGRenderableProps() {}

RNSVGClipPathProps::RNSVGClipPathProps(
    const PropsParserContext& context,
    const RNSVGClipPathProps& sourceProps,
    const RawProps& rawProps)
    : RNSVGRenderableProps(context, sourceProps, rawProps) {
  fontSize = readRawDynamic(rawProps, "fontSize");
  if (fontSize == nullptr) fontSize = sourceProps.fontSize;
  fontWeight = readRawDynamic(rawProps, "fontWeight");
  if (fontWeight == nullptr) fontWeight = sourceProps.fontWeight;
  font = readRawDynamic(rawProps, "font");
  if (font == nullptr) font = sourceProps.font;
}

} // namespace facebook::react
