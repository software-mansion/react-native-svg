/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "RNSVGNodeBaseShadowNode.h"

#include <react/renderer/core/LayoutConstraints.h>
#include <react/renderer/core/LayoutContext.h>

namespace facebook {
namespace react {

RNSVGNodeBaseShadowNode::RNSVGNodeBaseShadowNode(
    const ShadowNodeFragment &fragment,
    const ShadowNodeFamily::Shared &family,
    ShadowNodeTraits traits)
    : LayoutableShadowNode(fragment, family, traits) {}

RNSVGNodeBaseShadowNode::RNSVGNodeBaseShadowNode(
    const ShadowNode &sourceShadowNode,
    const ShadowNodeFragment &fragment)
    : LayoutableShadowNode(sourceShadowNode, fragment) {}

void RNSVGNodeBaseShadowNode::layoutTree(
    LayoutContext layoutContext,
    LayoutConstraints layoutConstraints) {}

void RNSVGNodeBaseShadowNode::layout(LayoutContext layoutContext) {}

void RNSVGNodeBaseShadowNode::cleanLayout() {}

void RNSVGNodeBaseShadowNode::dirtyLayout() {}

bool RNSVGNodeBaseShadowNode::getIsLayoutClean() const {
  return true;
}

} // namespace react
} // namespace facebook
