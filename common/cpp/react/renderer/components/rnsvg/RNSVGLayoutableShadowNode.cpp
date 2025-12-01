#include "RNSVGLayoutableShadowNode.h"
#include <react/renderer/core/LayoutContext.h>

namespace facebook::react {

RNSVGLayoutableShadowNode::RNSVGLayoutableShadowNode(
    const ShadowNodeFragment &fragment,
    const ShadowNodeFamily::Shared &family,
    ShadowNodeTraits traits)
    : YogaLayoutableShadowNode(fragment, family, traits) {
  updatePosition();
}

RNSVGLayoutableShadowNode::RNSVGLayoutableShadowNode(
    const ShadowNode &sourceShadowNode,
    const ShadowNodeFragment &fragment)
    : YogaLayoutableShadowNode(sourceShadowNode, fragment) {
  updatePosition();
}

void RNSVGLayoutableShadowNode::updatePosition() {
  // SVG handles its layout manually on the native side and does not depend on
  // the Yoga layout. Setting the dimensions to absolute fill is a hack for measure 
  // to return "correct" layout metrics when onPress is tested. It also eliminates 
  // randomly positioned views in the layout inspector when Yoga attempts to interpret 
  // SVG properties like width when viewBox scale is set. Ideal solution would be to 
  // return correct bounding box from native side in getLayoutMetrics.
  auto style = yogaNode_.style();
  style.setPositionType(yoga::PositionType::Absolute);
  style.setPosition(yoga::Edge::All, yoga::Style::Length::points(0));
  style.setDimension(yoga::Dimension::Width, yoga::StyleSizeLength::percent(100));
  style.setDimension(yoga::Dimension::Height, yoga::StyleSizeLength::percent(100));
  yogaNode_.setStyle(style);
}

void RNSVGLayoutableShadowNode::layout(LayoutContext layoutContext) {
  auto affectedNodes = layoutContext.affectedNodes;
  layoutContext.affectedNodes = nullptr;
  YogaLayoutableShadowNode::layout(layoutContext);
  layoutContext.affectedNodes = affectedNodes;
}

} // namespace facebook::react
