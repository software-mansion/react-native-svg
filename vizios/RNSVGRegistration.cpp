#include "RNSVGRegistration.h"
#include "RNSVGSvgViewComponentDescriptor.h"
#include "RNSVGComponentDescriptors.h"

namespace facebook::react {

void rnsvg_registerComponentDescriptors(
    ComponentDescriptorProviderRegistry& registry) {
  registry.add(concreteComponentDescriptorProvider<RNSVGSvgViewComponentDescriptor>());
  registry.add(concreteComponentDescriptorProvider<RNSVGGroupComponentDescriptor>());
  registry.add(concreteComponentDescriptorProvider<RNSVGPathComponentDescriptor>());
  registry.add(concreteComponentDescriptorProvider<RNSVGRectComponentDescriptor>());
  registry.add(concreteComponentDescriptorProvider<RNSVGCircleComponentDescriptor>());
  registry.add(concreteComponentDescriptorProvider<RNSVGLineComponentDescriptor>());
  registry.add(concreteComponentDescriptorProvider<RNSVGEllipseComponentDescriptor>());
  registry.add(concreteComponentDescriptorProvider<RNSVGDefsComponentDescriptor>());
  registry.add(concreteComponentDescriptorProvider<RNSVGClipPathComponentDescriptor>());
  registry.add(concreteComponentDescriptorProvider<RNSVGLinearGradientComponentDescriptor>());
  registry.add(concreteComponentDescriptorProvider<RNSVGRadialGradientComponentDescriptor>());
}

void rnsvg_addSupportedComponents(
    std::set<std::string, std::less<>>& components) {
  components.insert("RNSVGSvgView");
  components.insert("RNSVGGroup");
  components.insert("RNSVGPath");
  components.insert("RNSVGRect");
  components.insert("RNSVGCircle");
  components.insert("RNSVGLine");
  components.insert("RNSVGEllipse");
  components.insert("RNSVGDefs");
  components.insert("RNSVGClipPath");
  components.insert("RNSVGLinearGradient");
  components.insert("RNSVGRadialGradient");
}

} // namespace facebook::react
