#include "RNSVGRectProps.h"
#include <react/renderer/core/RawProps.h>

namespace facebook::react {

static folly::dynamic readRawDynamic(const RawProps& rawProps, const char* name) {
  const auto* raw = rawProps.at(name, nullptr, nullptr);
  if (raw != nullptr) {
    return (folly::dynamic)(*raw);
  }
  return nullptr;
}

RNSVGRectProps::RNSVGRectProps()
    : RNSVGRenderableProps() {}

RNSVGRectProps::RNSVGRectProps(
    const PropsParserContext& context,
    const RNSVGRectProps& sourceProps,
    const RawProps& rawProps)
    : RNSVGRenderableProps(context, sourceProps, rawProps) {
  x = readRawDynamic(rawProps, "x");
  if (x == nullptr) x = sourceProps.x;
  y = readRawDynamic(rawProps, "y");
  if (y == nullptr) y = sourceProps.y;
  width = readRawDynamic(rawProps, "width");
  if (width == nullptr) width = sourceProps.width;
  height = readRawDynamic(rawProps, "height");
  if (height == nullptr) height = sourceProps.height;
  rx = readRawDynamic(rawProps, "rx");
  if (rx == nullptr) rx = sourceProps.rx;
  ry = readRawDynamic(rawProps, "ry");
  if (ry == nullptr) ry = sourceProps.ry;
}

} // namespace facebook::react
