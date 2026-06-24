#include "RNSVGPathProps.h"
#include <react/renderer/core/propsConversions.h>
#include <react/renderer/core/RawProps.h>

namespace facebook::react {

RNSVGPathProps::RNSVGPathProps()
    : RNSVGRenderableProps() {}

RNSVGPathProps::RNSVGPathProps(
    const PropsParserContext& context,
    const RNSVGPathProps& sourceProps,
    const RawProps& rawProps)
    : RNSVGRenderableProps(context, sourceProps, rawProps),
      d(convertRawProp(context, rawProps, "d", sourceProps.d, std::string{})) {}

} // namespace facebook::react
