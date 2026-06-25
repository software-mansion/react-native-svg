#include "RNSVGSvgViewProps.h"

#include <react/renderer/core/RawProps.h>
#include <react/renderer/core/propsConversions.h>

namespace facebook::react {

RNSVGSvgViewProps::RNSVGSvgViewProps() = default;

RNSVGSvgViewProps::RNSVGSvgViewProps(
    const PropsParserContext& context,
    const RNSVGSvgViewProps& sourceProps,
    const RawProps& rawProps)
    : ViewProps(context, sourceProps, rawProps),
      svgUri(convertRawProp(context, rawProps, "svgUri", sourceProps.svgUri, std::string{})),
      minX(convertRawProp(context, rawProps, "minX", sourceProps.minX, 0.0f)),
      minY(convertRawProp(context, rawProps, "minY", sourceProps.minY, 0.0f)),
      vbWidth(convertRawProp(context, rawProps, "vbWidth", sourceProps.vbWidth, 0.0f)),
      vbHeight(convertRawProp(context, rawProps, "vbHeight", sourceProps.vbHeight, 0.0f)) {}

} // namespace facebook::react
