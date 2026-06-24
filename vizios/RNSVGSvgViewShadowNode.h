#pragma once

#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/components/view/ViewEventEmitter.h>
#include "RNSVGSvgViewProps.h"

namespace facebook::react {

extern const char RNSVGSvgViewComponentName[];

class RNSVGSvgViewShadowNode final : public ConcreteViewShadowNode<
                                         RNSVGSvgViewComponentName,
                                         RNSVGSvgViewProps,
                                         ViewEventEmitter> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
};

} // namespace facebook::react
