/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnsvg/EventEmitters.h>
#include <react/renderer/components/rnsvg/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook {
namespace react {

JSI_EXPORT extern const char RNSVGSvgViewComponentName[];

/*
 * `ShadowNode` for <RNSVGSvgView> component.
 */
class JSI_EXPORT RNSVGSvgViewShadowNode final : public ConcreteViewShadowNode<
                                                    RNSVGSvgViewComponentName,
                                                    RNSVGSvgViewProps> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

#pragma mark - LayoutableShadowNode

  Size measureContent(
      LayoutContext const &layoutContext,
      LayoutConstraints const &layoutConstraints) const override;
};

} // namespace react
} // namespace facebook
