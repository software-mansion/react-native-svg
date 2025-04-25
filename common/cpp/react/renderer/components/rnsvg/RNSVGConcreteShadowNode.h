#pragma once

#include <react/renderer/components/view/ViewEventEmitter.h>
#include <react/renderer/components/view/ViewProps.h>
#include <react/renderer/core/ConcreteShadowNode.h>
#include "RNSVGLayoutableShadowNode.h"

namespace facebook::react {

template <const char *concreteComponentName, typename PropsT = ViewProps>
class RNSVGConcreteShadowNode : public ConcreteShadowNode<
                                    concreteComponentName,
                                    RNSVGLayoutableShadowNode,
                                    PropsT,
                                    ViewEventEmitter,
                                    StateData> {
 public:
  using BaseShadowNode = ConcreteShadowNode<
      concreteComponentName,
      RNSVGLayoutableShadowNode,
      PropsT,
      ViewEventEmitter,
      StateData>;

  using ConcreteViewProps = PropsT;

  using BaseShadowNode::BaseShadowNode;

  static ShadowNodeTraits BaseTraits() {
    auto traits = BaseShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::ViewKind);
    traits.set(ShadowNodeTraits::Trait::FormsStackingContext);
    traits.set(ShadowNodeTraits::Trait::FormsView);
    return traits;
  }

  Transform getTransform() const override {
    auto layoutMetrics = BaseShadowNode::getLayoutMetrics();
    return BaseShadowNode::getConcreteProps().resolveTransform(layoutMetrics);
  }

  bool canBeTouchTarget() const override {
    auto pointerEvents =
        BaseShadowNode::getConcreteProps().ViewProps::pointerEvents;
    return pointerEvents == PointerEventsMode::Auto ||
        pointerEvents == PointerEventsMode::BoxOnly;
  }

  bool canChildrenBeTouchTarget() const override {
    auto pointerEvents =
        BaseShadowNode::getConcreteProps().ViewProps::pointerEvents;
    return pointerEvents == PointerEventsMode::Auto ||
        pointerEvents == PointerEventsMode::BoxNone;
  }
};

} // namespace facebook::react
