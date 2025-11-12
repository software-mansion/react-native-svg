// RNSVGComponentDescriptor.h
#pragma once
#include <react/debug/react_native_assert.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSVGShadowNodes.h"

namespace facebook::react {

template <typename ShadowNodeT>
class RNSVGComponentDescriptor final : public ConcreteComponentDescriptor<ShadowNodeT> {
public:
  using ConcreteComponentDescriptor<ShadowNodeT>::ConcreteComponentDescriptor;
  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(dynamic_cast<RNSVGLayoutableShadowNode *>(&shadowNode));

    auto layoutableShadowNode = dynamic_cast<RNSVGLayoutableShadowNode *>(&shadowNode);    
    auto state = std::static_pointer_cast<const typename ShadowNodeT::ConcreteState>(shadowNode.getState());
    auto stateData = state->getData();

    if (stateData.getWidth() != 0 && stateData.getHeight() != 0) {
      layoutableShadowNode->setSize(Size{stateData.getWidth(), stateData.getHeight()});
      layoutableShadowNode->setShadowNodePosition(stateData.getX(), stateData.getY());
    }

    ConcreteComponentDescriptor<ShadowNodeT>::adopt(shadowNode);
  }
};

} // namespace facebook::react
