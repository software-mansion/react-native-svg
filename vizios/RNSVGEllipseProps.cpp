#include "RNSVGEllipseProps.h"
#include <react/renderer/core/RawProps.h>

namespace facebook::react {

static folly::dynamic readRawDynamic(const RawProps& rawProps, const char* name) {
  const auto* raw = rawProps.at(name, nullptr, nullptr);
  if (raw != nullptr) {
    return (folly::dynamic)(*raw);
  }
  return nullptr;
}

RNSVGEllipseProps::RNSVGEllipseProps()
    : RNSVGRenderableProps() {}

RNSVGEllipseProps::RNSVGEllipseProps(
    const PropsParserContext& context,
    const RNSVGEllipseProps& sourceProps,
    const RawProps& rawProps)
    : RNSVGRenderableProps(context, sourceProps, rawProps) {
  cx = readRawDynamic(rawProps, "cx");
  if (cx == nullptr) cx = sourceProps.cx;
  cy = readRawDynamic(rawProps, "cy");
  if (cy == nullptr) cy = sourceProps.cy;
  rx = readRawDynamic(rawProps, "rx");
  if (rx == nullptr) rx = sourceProps.rx;
  ry = readRawDynamic(rawProps, "ry");
  if (ry == nullptr) ry = sourceProps.ry;
}

} // namespace facebook::react
