#pragma once

#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSVGSvgViewProps.h"

namespace facebook::react {

extern const char RNSVGSvgViewComponentName[];

using RNSVGSvgViewShadowNode = ConcreteViewShadowNode<
    RNSVGSvgViewComponentName,
    RNSVGSvgViewProps,
    ViewEventEmitter>;

} // namespace facebook::react
