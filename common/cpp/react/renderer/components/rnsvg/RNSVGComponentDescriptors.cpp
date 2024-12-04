#include "RNSVGComponentDescriptors.h"
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook::react {

void rnsvg_registerComponentDescriptorsFromCodegen(
    std::shared_ptr<const ComponentDescriptorProviderRegistry> registry) {
  registry->add(
      concreteComponentDescriptorProvider<RNSVGCircleComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGClipPathComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGDefsComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGEllipseComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGFeBlendComponentDescriptor>());
  registry->add(concreteComponentDescriptorProvider<
                RNSVGFeColorMatrixComponentDescriptor>());
  registry->add(concreteComponentDescriptorProvider<
                RNSVGFeCompositeComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGFeFloodComponentDescriptor>());
  registry->add(concreteComponentDescriptorProvider<
                RNSVGFeGaussianBlurComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGFeMergeComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGFeOffsetComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGFilterComponentDescriptor>());
  registry->add(concreteComponentDescriptorProvider<
                RNSVGForeignObjectComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGGroupComponentDescriptor>());
  registry->add(concreteComponentDescriptorProvider<
                RNSVGLinearGradientComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGLineComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGMarkerComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGMaskComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGPathComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGPatternComponentDescriptor>());
  registry->add(concreteComponentDescriptorProvider<
                RNSVGRadialGradientComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGRectComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGSymbolComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGTextComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGTextPathComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGTSpanComponentDescriptor>());
  registry->add(
      concreteComponentDescriptorProvider<RNSVGUseComponentDescriptor>());
}

} // namespace facebook::react
