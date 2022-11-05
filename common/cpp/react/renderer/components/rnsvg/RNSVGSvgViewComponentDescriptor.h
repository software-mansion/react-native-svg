/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <react/renderer/core/ConcreteComponentDescriptor.h>

#include "RNSVGSvgViewShadowNode.h"

namespace facebook {
namespace react {

/*
 * Descriptor for <RNSVGSvgView> component.
 */
class RNSVGSvgViewComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSVGSvgViewShadowNode> {
 public:
  RNSVGSvgViewComponentDescriptor(
      ComponentDescriptorParameters const &parameters)
      : ConcreteComponentDescriptor(parameters) {}

  void adopt(ShadowNode::Unshared const &shadowNode) const override {
    ConcreteComponentDescriptor::adopt(shadowNode);

    auto svgViewShadowNode =
        std::static_pointer_cast<RNSVGSvgViewShadowNode>(shadowNode);

    // All `RNSVGSvgViewShadowNode`s must have leaf Yoga nodes with
    // properly setup measure function.
    svgViewShadowNode->enableMeasurement();
  }
};

} // namespace react
} // namespace facebook
