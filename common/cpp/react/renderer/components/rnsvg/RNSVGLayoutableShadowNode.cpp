#include "RNSVGLayoutableShadowNode.h"
#include <react/renderer/core/LayoutContext.h>

namespace facebook::react {

RNSVGLayoutableShadowNode::RNSVGLayoutableShadowNode(
    const ShadowNodeFragment &fragment,
    const ShadowNodeFamily::Shared &family,
    ShadowNodeTraits traits)
    : YogaLayoutableShadowNode(fragment, family, traits) {
  if (std::strcmp(this->getComponentName(), "RNSVGGroup") != 0) {
    setZeroDimensions();
  }
}

RNSVGLayoutableShadowNode::RNSVGLayoutableShadowNode(
    const ShadowNode &sourceShadowNode,
    const ShadowNodeFragment &fragment)
    : YogaLayoutableShadowNode(sourceShadowNode, fragment) {
  if (std::strcmp(this->getComponentName(), "RNSVGGroup") != 0) {
    setZeroDimensions();
  }
}

void RNSVGLayoutableShadowNode::setZeroDimensions() {
  // SVG handles its layout manually on the native side and does not depend on
  // the Yoga layout. Setting the dimensions to 0 eliminates randomly positioned
  // views in the layout inspector when Yoga attempts to interpret SVG
  // properties like width when viewBox scale is set.
  auto style = yogaNode_.style();
  style.setDimension(yoga::Dimension::Width, yoga::StyleSizeLength::points(0));
  style.setDimension(yoga::Dimension::Height, yoga::StyleSizeLength::points(0));
  yogaNode_.setStyle(style);
}

void RNSVGLayoutableShadowNode::layout(LayoutContext layoutContext) {
  auto affectedNodes = layoutContext.affectedNodes;
  layoutContext.affectedNodes = nullptr;
  YogaLayoutableShadowNode::layout(layoutContext);
  layoutContext.affectedNodes = affectedNodes;
}

} // namespace facebook::react
