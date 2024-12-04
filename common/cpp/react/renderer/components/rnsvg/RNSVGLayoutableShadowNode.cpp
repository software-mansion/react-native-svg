#include "RNSVGLayoutableShadowNode.h"
#include <react/renderer/core/LayoutContext.h>

namespace facebook::react {

RNSVGLayoutableShadowNode::RNSVGLayoutableShadowNode(
    const ShadowNodeFragment &fragment,
    const ShadowNodeFamily::Shared &family,
    ShadowNodeTraits traits)
    : YogaLayoutableShadowNode(fragment, family, traits) {
  auto style = yogaNode_.style();
  style.setDimension(yoga::Dimension::Width, yoga::value::points(0));
  style.setDimension(yoga::Dimension::Height, yoga::value::points(0));
  yogaNode_.setStyle(style);
}

RNSVGLayoutableShadowNode::RNSVGLayoutableShadowNode(
    const ShadowNode &sourceShadowNode,
    const ShadowNodeFragment &fragment)
    : YogaLayoutableShadowNode(sourceShadowNode, fragment) {
  auto style = yogaNode_.style();
  style.setDimension(yoga::Dimension::Width, yoga::value::points(0));
  style.setDimension(yoga::Dimension::Height, yoga::value::points(0));
  yogaNode_.setStyle(style);
}

void RNSVGLayoutableShadowNode::layout(LayoutContext layoutContext) {
  auto affectedNodes = layoutContext.affectedNodes;
  layoutContext.affectedNodes = nullptr;
  YogaLayoutableShadowNode::layout(layoutContext);
  layoutContext.affectedNodes = affectedNodes;
}

} // namespace facebook::react
