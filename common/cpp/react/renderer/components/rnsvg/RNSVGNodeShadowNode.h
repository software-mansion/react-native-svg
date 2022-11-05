/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/components/view/ViewEventEmitter.h>
#include <react/renderer/core/ConcreteShadowNode.h>

namespace facebook {
namespace react {

#ifdef ANDROID

template <ComponentName concreteComponentName, typename PropsT>
using RNSVGNodeShadowNode =
    ConcreteViewShadowNode<concreteComponentName, PropsT>;

#else

template <ComponentName concreteComponentName, typename PropsT>
class RNSVGNodeShadowNode : public ConcreteShadowNode<
                                concreteComponentName,
                                ShadowNode,
                                PropsT,
                                ViewEventEmitter> {
 public:
  using BaseShadowNode = ConcreteShadowNode<
      concreteComponentName,
      ShadowNode,
      PropsT,
      ViewEventEmitter>;
  using BaseShadowNode::BaseShadowNode;

  static ShadowNodeTraits BaseTraits() {
    auto traits = BaseShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::FormsView);
    traits.set(ShadowNodeTraits::Trait::FormsStackingContext);
    return traits;
  }
};
#endif

} // namespace react
} // namespace facebook
