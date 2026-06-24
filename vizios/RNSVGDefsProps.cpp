#include "RNSVGDefsProps.h"
#include <react/renderer/core/RawProps.h>

namespace facebook::react {

RNSVGDefsProps::RNSVGDefsProps()
    : ViewProps() {}

RNSVGDefsProps::RNSVGDefsProps(
    const PropsParserContext& context,
    const RNSVGDefsProps& sourceProps,
    const RawProps& rawProps)
    : ViewProps(context, sourceProps, rawProps),
      node(parseSvgNodeProps(context, rawProps, sourceProps.node)) {}

} // namespace facebook::react
