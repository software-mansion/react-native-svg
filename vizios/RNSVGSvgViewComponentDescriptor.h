#pragma once

#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSVGSvgViewShadowNode.h"

namespace facebook::react {

class RNSVGSvgViewComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSVGSvgViewShadowNode> {
 public:
  explicit RNSVGSvgViewComponentDescriptor(const ComponentDescriptorParameters& p)
      : ConcreteComponentDescriptor(p) {}
};

} // namespace facebook::react
