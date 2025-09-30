#pragma once

#include <ReactCommon/JavaTurboModule.h>
#include <ReactCommon/TurboModule.h>
#include <jsi/jsi.h>
#include <react/renderer/components/rnsvg/RNSVGComponentDescriptors.h>
#include <react/renderer/components/rnsvg/RNSVGImageComponentDescriptor.h>

namespace facebook {
namespace react {

/**
 * JNI C++ class for module 'NativeSvgRenderableModule'
 */
class JSI_EXPORT NativeSvgRenderableModuleSpecJSI : public JavaTurboModule {
public:
  NativeSvgRenderableModuleSpecJSI(const JavaTurboModule::InitParams &params);
};

/**
 * JNI C++ class for module 'NativeSvgViewModule'
 */
class JSI_EXPORT NativeSvgViewModuleSpecJSI : public JavaTurboModule {
public:
  NativeSvgViewModuleSpecJSI(const JavaTurboModule::InitParams &params);
};


JSI_EXPORT
std::shared_ptr<TurboModule> rnsvg_ModuleProvider(const std::string &moduleName, const JavaTurboModule::InitParams &params);

} // namespace react
} // namespace facebook