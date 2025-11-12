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
    auto state = layoutableShadowNode->getStateData();

    if (state.getWidth() != 0 && state.getHeight() != 0) {
      layoutableShadowNode->setSize(Size{state.getWidth(), state.getHeight()});
      layoutableShadowNode->setShadowNodePosition(state.getX(), state.getY());
    }

    ConcreteComponentDescriptor<ShadowNodeT>::adopt(shadowNode);
  }
};

} // namespace facebook::react
