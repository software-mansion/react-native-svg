#pragma once

#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSVGSvgViewShadowNode.h"
#include "RNSVGShadowNodes.h"

namespace facebook::react {

class RNSVGGroupComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSVGGroupShadowNode> {
 public:
  explicit RNSVGGroupComponentDescriptor(const ComponentDescriptorParameters& p)
      : ConcreteComponentDescriptor(p) {}
};

class RNSVGPathComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSVGPathShadowNode> {
 public:
  explicit RNSVGPathComponentDescriptor(const ComponentDescriptorParameters& p)
      : ConcreteComponentDescriptor(p) {}
};

class RNSVGRectComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSVGRectShadowNode> {
 public:
  explicit RNSVGRectComponentDescriptor(const ComponentDescriptorParameters& p)
      : ConcreteComponentDescriptor(p) {}
};

class RNSVGCircleComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSVGCircleShadowNode> {
 public:
  explicit RNSVGCircleComponentDescriptor(const ComponentDescriptorParameters& p)
      : ConcreteComponentDescriptor(p) {}
};

class RNSVGLineComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSVGLineShadowNode> {
 public:
  explicit RNSVGLineComponentDescriptor(const ComponentDescriptorParameters& p)
      : ConcreteComponentDescriptor(p) {}
};

class RNSVGEllipseComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSVGEllipseShadowNode> {
 public:
  explicit RNSVGEllipseComponentDescriptor(const ComponentDescriptorParameters& p)
      : ConcreteComponentDescriptor(p) {}
};

class RNSVGDefsComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSVGDefsShadowNode> {
 public:
  explicit RNSVGDefsComponentDescriptor(const ComponentDescriptorParameters& p)
      : ConcreteComponentDescriptor(p) {}
};

class RNSVGClipPathComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSVGClipPathShadowNode> {
 public:
  explicit RNSVGClipPathComponentDescriptor(const ComponentDescriptorParameters& p)
      : ConcreteComponentDescriptor(p) {}
};

class RNSVGLinearGradientComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSVGLinearGradientShadowNode> {
 public:
  explicit RNSVGLinearGradientComponentDescriptor(const ComponentDescriptorParameters& p)
      : ConcreteComponentDescriptor(p) {}
};

class RNSVGRadialGradientComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSVGRadialGradientShadowNode> {
 public:
  explicit RNSVGRadialGradientComponentDescriptor(const ComponentDescriptorParameters& p)
      : ConcreteComponentDescriptor(p) {}
};

} // namespace facebook::react
