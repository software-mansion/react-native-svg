#include "RNSVGSvgViewProps.h"
#include <react/renderer/core/propsConversions.h>
#include <react/renderer/core/RawProps.h>

namespace facebook::react {

static folly::dynamic readRawDynamic(const RawProps& rawProps, const char* name) {
  const auto* raw = rawProps.at(name, nullptr, nullptr);
  if (raw != nullptr) {
    return (folly::dynamic)(*raw);
  }
  return nullptr;
}

RNSVGSvgViewProps::RNSVGSvgViewProps()
    : ViewProps() {}

RNSVGSvgViewProps::RNSVGSvgViewProps(
    const PropsParserContext& context,
    const RNSVGSvgViewProps& sourceProps,
    const RawProps& rawProps)
    : ViewProps(context, sourceProps, rawProps),
      minX(convertRawProp(context, rawProps, "minX", sourceProps.minX, Float{0.0f})),
      minY(convertRawProp(context, rawProps, "minY", sourceProps.minY, Float{0.0f})),
      vbWidth(convertRawProp(context, rawProps, "vbWidth", sourceProps.vbWidth, Float{0.0f})),
      vbHeight(convertRawProp(context, rawProps, "vbHeight", sourceProps.vbHeight, Float{0.0f})),
      align(convertRawProp(context, rawProps, "align", sourceProps.align, std::string{})),
      meetOrSlice(convertRawProp(context, rawProps, "meetOrSlice", sourceProps.meetOrSlice, 0)),
      color(convertRawProp(context, rawProps, "color", sourceProps.color, SharedColor{})),
      pointerEvents(convertRawProp(context, rawProps, "pointerEvents", sourceProps.pointerEvents, std::string{})) {
  bbWidth = readRawDynamic(rawProps, "bbWidth");
  if (bbWidth == nullptr) bbWidth = sourceProps.bbWidth;
  bbHeight = readRawDynamic(rawProps, "bbHeight");
  if (bbHeight == nullptr) bbHeight = sourceProps.bbHeight;
}

} // namespace facebook::react
