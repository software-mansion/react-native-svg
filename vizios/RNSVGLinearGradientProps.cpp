#include "RNSVGLinearGradientProps.h"
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

RNSVGLinearGradientProps::RNSVGLinearGradientProps()
    : ViewProps() {}

RNSVGLinearGradientProps::RNSVGLinearGradientProps(
    const PropsParserContext& context,
    const RNSVGLinearGradientProps& sourceProps,
    const RawProps& rawProps)
    : ViewProps(context, sourceProps, rawProps),
      node(parseSvgNodeProps(context, rawProps, sourceProps.node)),
      gradient(readFloatArray(rawProps, "gradient", sourceProps.gradient)),
      gradientUnits(convertRawProp(context, rawProps, "gradientUnits", sourceProps.gradientUnits, 0)),
      gradientTransform(readFloatArray(rawProps, "gradientTransform", sourceProps.gradientTransform)) {
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
