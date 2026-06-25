#pragma once

#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>
#include <set>
#include <string>

namespace facebook::react {

void rnsvg_registerComponentDescriptors(
    ComponentDescriptorProviderRegistry& registry);

void rnsvg_addSupportedComponents(
    std::set<std::string, std::less<>>& components);

} // namespace facebook::react
