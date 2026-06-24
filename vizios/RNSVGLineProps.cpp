#include "RNSVGLineProps.h"
#include <react/renderer/core/RawProps.h>

namespace facebook::react {

static folly::dynamic readRawDynamic(const RawProps& rawProps, const char* name) {
  const auto* raw = rawProps.at(name, nullptr, nullptr);
  if (raw != nullptr) {
    return (folly::dynamic)(*raw);
  }
  return nullptr;
}

RNSVGLineProps::RNSVGLineProps()
    : RNSVGRenderableProps() {}

RNSVGLineProps::RNSVGLineProps(
    const PropsParserContext& context,
    const RNSVGLineProps& sourceProps,
    const RawProps& rawProps)
    : RNSVGRenderableProps(context, sourceProps, rawProps) {
  x1 = readRawDynamic(rawProps, "x1");
  if (x1 == nullptr) x1 = sourceProps.x1;
  y1 = readRawDynamic(rawProps, "y1");
  if (y1 == nullptr) y1 = sourceProps.y1;
  x2 = readRawDynamic(rawProps, "x2");
  if (x2 == nullptr) x2 = sourceProps.x2;
  y2 = readRawDynamic(rawProps, "y2");
  if (y2 == nullptr) y2 = sourceProps.y2;
}

} // namespace facebook::react
