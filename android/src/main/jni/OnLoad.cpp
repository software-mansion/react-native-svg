#include <fbjni/fbjni.h>

#include "RNSvgComponentsRegistry.h"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *) {
  return facebook::jni::initialize(vm, [] {
    facebook::react::RNSvgComponentsRegistry::registerNatives();
  });
}