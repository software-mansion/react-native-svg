#include "RNSVGRadialGradientProps.h"
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

static std::vector<Float> readFloatArray(const RawProps& rawProps, const char* name,
                                          const std::vector<Float>& defaultVal) {
  const auto* raw = rawProps.at(name, nullptr, nullptr);
  if (raw == nullptr) return defaultVal;
  auto arr = (folly::dynamic)(*raw);
  if (!arr.isArray()) return defaultVal;
  std::vector<Float> result;
  result.reserve(arr.size());
  for (const auto& item : arr) {
    result.push_back(static_cast<Float>(item.asDouble()));
  }
  return result;
}

RNSVGRadialGradientProps::RNSVGRadialGradientProps()
    : ViewProps() {}

RNSVGRadialGradientProps::RNSVGRadialGradientProps(
    const PropsParserContext& context,
    const RNSVGRadialGradientProps& sourceProps,
    const RawProps& rawProps)
    : ViewProps(context, sourceProps, rawProps),
      node(parseSvgNodeProps(context, rawProps, sourceProps.node)),
      gradient(readFloatArray(rawProps, "gradient", sourceProps.gradient)),
      gradientUnits(convertRawProp(context, rawProps, "gradientUnits", sourceProps.gradientUnits, 0)),
      gradientTransform(readFloatArray(rawProps, "gradientTransform", sourceProps.gradientTransform)) {
  fx = readRawDynamic(rawProps, "fx");
  if (fx == nullptr) fx = sourceProps.fx;
  fy = readRawDynamic(rawProps, "fy");
  if (fy == nullptr) fy = sourceProps.fy;
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
