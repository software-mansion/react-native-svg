#pragma once

#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>
#include <set>
#include <string>

namespace facebook::react {

// Register all RNSVG component descriptors with the provider registry.
void rnsvg_registerComponentDescriptors(
    ComponentDescriptorProviderRegistry& registry);

// Add all RNSVG component names to the supported components set.
void rnsvg_addSupportedComponents(
    std::set<std::string, std::less<>>& components);

} // namespace facebook::react
