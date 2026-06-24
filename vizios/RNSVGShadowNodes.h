#pragma once

#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/components/view/ViewEventEmitter.h>

#include "RNSVGGroupProps.h"
#include "RNSVGPathProps.h"
#include "RNSVGRectProps.h"
#include "RNSVGCircleProps.h"
#include "RNSVGLineProps.h"
#include "RNSVGEllipseProps.h"
#include "RNSVGDefsProps.h"
#include "RNSVGClipPathProps.h"
#include "RNSVGLinearGradientProps.h"
#include "RNSVGRadialGradientProps.h"

namespace facebook::react {

// Component name externs (defined in RNSVGShadowNodes.cpp)
extern const char RNSVGGroupComponentName[];
extern const char RNSVGPathComponentName[];
extern const char RNSVGRectComponentName[];
extern const char RNSVGCircleComponentName[];
extern const char RNSVGLineComponentName[];
extern const char RNSVGEllipseComponentName[];
extern const char RNSVGDefsComponentName[];
extern const char RNSVGClipPathComponentName[];
extern const char RNSVGLinearGradientComponentName[];
extern const char RNSVGRadialGradientComponentName[];

// SVG child elements are positioned by SVG coordinates, not Yoga flexbox.
// They must fill their parent (the SVG root) so that Fabric gives them
// proper layout metrics and loki doesn't cull them as zero-sized widgets.
// This mirrors upstream RNSVGLayoutableShadowNode::updatePosition().
#define RNSVG_SHADOW_NODE(ClassName, ComponentName, PropsType)               \
class ClassName final : public ConcreteViewShadowNode<                       \
    ComponentName, PropsType, ViewEventEmitter> {                            \
  using Base = ConcreteViewShadowNode;                                       \
 public:                                                                     \
  ClassName(const ShadowNodeFragment &fragment,                              \
            const ShadowNodeFamily::Shared &family,                          \
            ShadowNodeTraits traits)                                         \
      : Base(fragment, family, traits) { initSVGLayout(); }                  \
  ClassName(const ShadowNode &sourceShadowNode,                              \
            const ShadowNodeFragment &fragment)                              \
      : Base(sourceShadowNode, fragment) { initSVGLayout(); }               \
 private:                                                                    \
  void initSVGLayout() {                                                     \
    auto style = yogaNode_.style();                                          \
    style.setPositionType(yoga::PositionType::Absolute);                     \
    style.setPosition(yoga::Edge::All, yoga::StyleLength::points(0));        \
    style.setDimension(yoga::Dimension::Width,                               \
                       yoga::StyleSizeLength::percent(100));                  \
    style.setDimension(yoga::Dimension::Height,                              \
                       yoga::StyleSizeLength::percent(100));                  \
    yogaNode_.setStyle(style);                                               \
  }                                                                          \
};

RNSVG_SHADOW_NODE(RNSVGGroupShadowNode,          RNSVGGroupComponentName,          RNSVGGroupProps)
RNSVG_SHADOW_NODE(RNSVGPathShadowNode,           RNSVGPathComponentName,           RNSVGPathProps)
RNSVG_SHADOW_NODE(RNSVGRectShadowNode,           RNSVGRectComponentName,           RNSVGRectProps)
RNSVG_SHADOW_NODE(RNSVGCircleShadowNode,         RNSVGCircleComponentName,         RNSVGCircleProps)
RNSVG_SHADOW_NODE(RNSVGLineShadowNode,           RNSVGLineComponentName,           RNSVGLineProps)
RNSVG_SHADOW_NODE(RNSVGEllipseShadowNode,        RNSVGEllipseComponentName,        RNSVGEllipseProps)
RNSVG_SHADOW_NODE(RNSVGDefsShadowNode,           RNSVGDefsComponentName,           RNSVGDefsProps)
RNSVG_SHADOW_NODE(RNSVGClipPathShadowNode,       RNSVGClipPathComponentName,       RNSVGClipPathProps)
RNSVG_SHADOW_NODE(RNSVGLinearGradientShadowNode, RNSVGLinearGradientComponentName, RNSVGLinearGradientProps)
RNSVG_SHADOW_NODE(RNSVGRadialGradientShadowNode, RNSVGRadialGradientComponentName, RNSVGRadialGradientProps)

#undef RNSVG_SHADOW_NODE

} // namespace facebook::react
