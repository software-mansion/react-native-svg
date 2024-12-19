#include "RNSVGLayoutableShadowNode.h"
#include <react/renderer/core/LayoutContext.h>

namespace facebook::react {

RNSVGLayoutableShadowNode::RNSVGLayoutableShadowNode(
    const ShadowNodeFragment &fragment,
    const ShadowNodeFamily::Shared &family,
    ShadowNodeTraits traits)
    : YogaLayoutableShadowNode(fragment, family, traits) {
  setZeroDimensions();
}

RNSVGLayoutableShadowNode::RNSVGLayoutableShadowNode(
    const ShadowNode &sourceShadowNode,
    const ShadowNodeFragment &fragment)
    : YogaLayoutableShadowNode(sourceShadowNode, fragment) {
  setZeroDimensions();
}

void RNSVGLayoutableShadowNode::setZeroDimensions() {
  // SVG handles its layout manually on the native side and does not depend on
  // the Yoga layout. Setting the dimensions to 0 eliminates randomly positioned
  // views in the layout inspector when Yoga attempts to interpret SVG
  // properties like width when viewBox scale is set.
  auto style = yogaNode_.style();
#if REACT_NATIVE_MINOR_VERSION >= 77
  style.setDimension(yoga::Dimension::Width, yoga::StyleLength::points(0));
  style.setDimension(yoga::Dimension::Height, yoga::StyleLength::points(0));
#else
  style.setDimension(yoga::Dimension::Width, yoga::value::points(0));
  style.setDimension(yoga::Dimension::Height, yoga::value::points(0));
#endif
  yogaNode_.setStyle(style);
}

void RNSVGLayoutableShadowNode::layout(LayoutContext layoutContext) {
  auto affectedNodes = layoutContext.affectedNodes;
  layoutContext.affectedNodes = nullptr;
  YogaLayoutableShadowNode::layout(layoutContext);
  layoutContext.affectedNodes = affectedNodes;
}

} // namespace facebook::react
