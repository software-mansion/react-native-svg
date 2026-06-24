#include "RNSVGRenderableProps.h"
#include <react/renderer/core/RawProps.h>

namespace facebook::react {

RNSVGRenderableProps::RNSVGRenderableProps()
    : ViewProps() {}

RNSVGRenderableProps::RNSVGRenderableProps(
    const PropsParserContext& context,
    const RNSVGRenderableProps& sourceProps,
    const RawProps& rawProps)
    : ViewProps(context, sourceProps, rawProps),
      node(parseSvgNodeProps(context, rawProps, sourceProps.node)),
      renderable(parseSvgRenderableProps(context, rawProps, sourceProps.renderable)) {}

} // namespace facebook::react
