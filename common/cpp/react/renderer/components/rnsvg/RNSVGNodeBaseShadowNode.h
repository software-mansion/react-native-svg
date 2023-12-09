/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <react/renderer/core/LayoutableShadowNode.h>

namespace facebook {
namespace react {

/**
 * Base shadow node used as base class for all nodes.
 *
 * Currently Fabric on Android requires shadow nodes to be subclasses of
 * LayoutableShadowNode so that it can instantiate views and setup the view
 * hierarchy properly. SVG nodes don't need layout so we just implement empty
 * methods.
 */
class RNSVGNodeBaseShadowNode : public LayoutableShadowNode {
 public:
  RNSVGNodeBaseShadowNode(
      const ShadowNodeFragment &fragment,
      const ShadowNodeFamily::Shared &family,
      ShadowNodeTraits traits);

  RNSVGNodeBaseShadowNode(
      const ShadowNode &sourceShadowNode,
      const ShadowNodeFragment &fragment);

  virtual void layoutTree(
      LayoutContext layoutContext,
      LayoutConstraints layoutConstraints);
  virtual void layout(LayoutContext layoutContext);
  virtual void cleanLayout();
  virtual void dirtyLayout();
  virtual bool getIsLayoutClean() const;

  static ShadowNodeTraits BaseTraits() {
    auto traits = LayoutableShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::FormsStackingContext);
    traits.set(ShadowNodeTraits::Trait::FormsView);
    return traits;
  }
};

} // namespace react
} // namespace facebook
