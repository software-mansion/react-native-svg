#include "RNSvgComponentsRegistry.h"

#include <CoreComponentsRegistry.h>
#include <fbjni/fbjni.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>
#include <react/renderer/components/rnsvg/ComponentDescriptors.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>

namespace facebook {
namespace react {

RNSvgComponentsRegistry::RNSvgComponentsRegistry(
    ComponentFactory *delegate)
    : delegate_(delegate) {}

std::shared_ptr<ComponentDescriptorProviderRegistry const>
RNSvgComponentsRegistry::sharedProviderRegistry() {
  auto providerRegistry = CoreComponentsRegistry::sharedProviderRegistry();

  // Svg
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGCircleComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGClipPathComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGDefsComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGEllipseComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGForeignObjectComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGGroupComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGImageComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGLinearGradientComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGLineComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGMarkerComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGMaskComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGPathComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGPatternComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGRadialGradientComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGRectComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGSvgViewComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGSymbolComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGTextComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGTextPathComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGTSpanComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSVGUseComponentDescriptor>());

  return providerRegistry;
}

jni::local_ref<RNSvgComponentsRegistry::jhybriddata>
RNSvgComponentsRegistry::initHybrid(
    jni::alias_ref<jclass>,
    ComponentFactory *delegate) {
  auto instance = makeCxxInstance(delegate);

  auto buildRegistryFunction =
      [](EventDispatcher::Weak const &eventDispatcher,
         ContextContainer::Shared const &contextContainer)
      -> ComponentDescriptorRegistry::Shared {
    auto registry = RNSvgComponentsRegistry::sharedProviderRegistry()
                        ->createComponentDescriptorRegistry(
                            {eventDispatcher, contextContainer});

    return registry;
  };

  delegate->buildRegistryFunction = buildRegistryFunction;
  return instance;
}

void RNSvgComponentsRegistry::registerNatives() {
  registerHybrid({
      makeNativeMethod("initHybrid", RNSvgComponentsRegistry::initHybrid),
  });
}

} // namespace react
} // namespace facebook
