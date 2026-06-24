#include "RNSVGCommonProps.h"
#include <react/renderer/core/propsConversions.h>
#include <react/renderer/core/RawProps.h>
#include <folly/dynamic.h>

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

static std::vector<std::string> readStringArray(const RawProps& rawProps, const char* name,
                                                 const std::vector<std::string>& defaultVal) {
  const auto* raw = rawProps.at(name, nullptr, nullptr);
  if (raw == nullptr) return defaultVal;
  auto arr = (folly::dynamic)(*raw);
  if (!arr.isArray()) return defaultVal;
  std::vector<std::string> result;
  result.reserve(arr.size());
  for (const auto& item : arr) {
    if (item.isString()) {
      result.push_back(item.getString());
    }
  }
  return result;
}

SvgNodeProps parseSvgNodeProps(
    const PropsParserContext& context,
    const RawProps& rawProps,
    const SvgNodeProps& sourceProps) {
  SvgNodeProps result = sourceProps;
  result.name = convertRawProp(context, rawProps, "name", sourceProps.name, std::string{});
  result.opacity = convertRawProp(context, rawProps, "opacity", sourceProps.opacity, Float{1.0f});
  result.matrix = readFloatArray(rawProps, "matrix", sourceProps.matrix);
  result.mask = convertRawProp(context, rawProps, "mask", sourceProps.mask, std::string{});
  result.markerStart = convertRawProp(context, rawProps, "markerStart", sourceProps.markerStart, std::string{});
  result.markerMid = convertRawProp(context, rawProps, "markerMid", sourceProps.markerMid, std::string{});
  result.markerEnd = convertRawProp(context, rawProps, "markerEnd", sourceProps.markerEnd, std::string{});
  result.clipPath = convertRawProp(context, rawProps, "clipPath", sourceProps.clipPath, std::string{});
  result.clipRule = convertRawProp(context, rawProps, "clipRule", sourceProps.clipRule, 0);
  result.responsible = convertRawProp(context, rawProps, "responsible", sourceProps.responsible, false);
  result.display = convertRawProp(context, rawProps, "display", sourceProps.display, std::string{});
  result.pointerEvents = convertRawProp(context, rawProps, "pointerEvents", sourceProps.pointerEvents, std::string{});
  return result;
}

SvgRenderableProps parseSvgRenderableProps(
    const PropsParserContext& context,
    const RawProps& rawProps,
    const SvgRenderableProps& sourceProps) {
  SvgRenderableProps result = sourceProps;
  result.fill = readRawDynamic(rawProps, "fill");
  if (result.fill == nullptr) result.fill = sourceProps.fill;
  result.fillOpacity = convertRawProp(context, rawProps, "fillOpacity", sourceProps.fillOpacity, Float{1.0f});
  result.fillRule = convertRawProp(context, rawProps, "fillRule", sourceProps.fillRule, 1);
  result.stroke = readRawDynamic(rawProps, "stroke");
  if (result.stroke == nullptr) result.stroke = sourceProps.stroke;
  result.strokeOpacity = convertRawProp(context, rawProps, "strokeOpacity", sourceProps.strokeOpacity, Float{1.0f});
  result.strokeWidth = readRawDynamic(rawProps, "strokeWidth");
  if (result.strokeWidth == nullptr) result.strokeWidth = sourceProps.strokeWidth;
  result.strokeLinecap = convertRawProp(context, rawProps, "strokeLinecap", sourceProps.strokeLinecap, 0);
  result.strokeLinejoin = convertRawProp(context, rawProps, "strokeLinejoin", sourceProps.strokeLinejoin, 0);
  result.strokeDasharray = readRawDynamic(rawProps, "strokeDasharray");
  if (result.strokeDasharray == nullptr) result.strokeDasharray = sourceProps.strokeDasharray;
  result.strokeDashoffset = convertRawProp(context, rawProps, "strokeDashoffset", sourceProps.strokeDashoffset, Float{0.0f});
  result.strokeMiterlimit = convertRawProp(context, rawProps, "strokeMiterlimit", sourceProps.strokeMiterlimit, Float{0.0f});
  result.vectorEffect = convertRawProp(context, rawProps, "vectorEffect", sourceProps.vectorEffect, 0);
  result.propList = readStringArray(rawProps, "propList", sourceProps.propList);
  result.filter = convertRawProp(context, rawProps, "filter", sourceProps.filter, std::string{});
  return result;
}

} // namespace facebook::react
