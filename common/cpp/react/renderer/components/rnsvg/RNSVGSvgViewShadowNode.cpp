/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <react/renderer/core/LayoutConstraints.h>
#include <react/renderer/core/LayoutContext.h>

#include "RNSVGSvgViewMeasurement.h"
#include "RNSVGSvgViewShadowNode.h"

namespace facebook {
namespace react {

const char RNSVGSvgViewComponentName[] = "RNSVGSvgView";

#pragma mark - LayoutableShadowNode

Size RNSVGSvgViewShadowNode::measureContent(
    LayoutContext const & /*layoutContext*/,
    LayoutConstraints const &layoutConstraints) const {
  const auto &props = getConcreteProps();
  return measureSvgView(layoutConstraints, props.vbWidth, props.vbHeight);
}

} // namespace react
} // namespace facebook
