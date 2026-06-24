#include "RNSVGCircleProps.h"
#include <react/renderer/core/RawProps.h>

namespace facebook::react {

static folly::dynamic readRawDynamic(const RawProps& rawProps, const char* name) {
  const auto* raw = rawProps.at(name, nullptr, nullptr);
  if (raw != nullptr) {
    return (folly::dynamic)(*raw);
  }
  return nullptr;
}

RNSVGCircleProps::RNSVGCircleProps()
    : RNSVGRenderableProps() {}

RNSVGCircleProps::RNSVGCircleProps(
    const PropsParserContext& context,
    const RNSVGCircleProps& sourceProps,
    const RawProps& rawProps)
    : RNSVGRenderableProps(context, sourceProps, rawProps) {
  cx = readRawDynamic(rawProps, "cx");
  if (cx == nullptr) cx = sourceProps.cx;
  cy = readRawDynamic(rawProps, "cy");
  if (cy == nullptr) cy = sourceProps.cy;
  r = readRawDynamic(rawProps, "r");
  if (r == nullptr) r = sourceProps.r;
}

} // namespace facebook::react
