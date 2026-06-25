#include "RNSVGRegistration.h"
#include "RNSVGSvgViewComponentDescriptor.h"

namespace facebook::react {

void rnsvg_registerComponentDescriptors(
    ComponentDescriptorProviderRegistry& registry) {
  registry.add(concreteComponentDescriptorProvider<RNSVGSvgViewComponentDescriptor>());
}

void rnsvg_addSupportedComponents(
    std::set<std::string, std::less<>>& components) {
  components.insert("RNSVGSvgView");
}

} // namespace facebook::react
