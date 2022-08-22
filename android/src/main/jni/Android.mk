SVG_MAIN_THIS_DIR := $(call my-dir)

include $(SVG_MAIN_THIS_DIR)/../../../build/generated/source/codegen/jni/Android.mk

include $(CLEAR_VARS)

LOCAL_PATH := $(SVG_MAIN_THIS_DIR)
LOCAL_MODULE := rnsvg_modules

LOCAL_C_INCLUDES := $(LOCAL_PATH) $(GENERATED_SRC_DIR)/codegen/jni
LOCAL_SRC_FILES := $(wildcard $(LOCAL_PATH)/*.cpp) $(wildcard $(GENERATED_SRC_DIR)/codegen/jni/*.cpp)
LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH) $(GENERATED_SRC_DIR)/codegen/jni

# Please note as one of the library listed is libreact_codegen_samplelibrary
# This name will be generated as libreact_codegen_<library-name>
# where <library-name> is the one you specified in the Gradle configuration
LOCAL_SHARED_LIBRARIES := libjsi \
    libfbjni \
    libglog \
    libfolly_runtime \
    libyoga \
    libreact_nativemodule_core \
    libturbomodulejsijni \
    librrc_view \
    libreact_render_core \
    libreact_render_graphics \
    libfabricjni \
    libreact_debug \
    libreact_render_componentregistry \
    libreact_render_debug \
    libruntimeexecutor \
    libreact_render_mapbuffer \
    libreact_codegen_rncore \
    libreact_codegen_rnsvg

LOCAL_CFLAGS := \
    -DLOG_TAG=\"ReactNative\"
LOCAL_CFLAGS += -fexceptions -frtti -std=c++17 -Wall

include $(BUILD_SHARED_LIBRARY)
