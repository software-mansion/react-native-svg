cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

set(RNS_ANDROID_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../../..)
set(RNS_COMMON_DIR ${RNS_ANDROID_DIR}/../common/cpp)
set(RNS_GENERATED_DIR ${RNS_ANDROID_DIR}/build/generated)
set(RNS_GENERATED_JNI_DIR ${RNS_GENERATED_DIR}/source/codegen/jni)
set(RNS_GENERATED_REACT_DIR ${RNS_GENERATED_JNI_DIR}/react/renderer/components/rnsvg)

add_compile_options(
  -fexceptions
  -frtti
  -std=c++20
  -Wall
  -Wpedantic
  -Wno-gnu-zero-variadic-macro-arguments
)

file(GLOB rnsvg_SRCS CONFIGURE_DEPENDS *.cpp ${RNS_COMMON_DIR}/react/renderer/components/rnsvg/*.cpp)
file(GLOB rnsvg_codegen_SRCS CONFIGURE_DEPENDS ${RNS_GENERATED_REACT_DIR}/*cpp)

add_library(
  react_codegen_rnsvg
  SHARED 
  ${rnsvg_SRCS}
  ${rnsvg_codegen_SRCS}
)

target_include_directories(
  react_codegen_rnsvg 
  PUBLIC 
  . 
  ${RNS_COMMON_DIR}
  ${RNS_GENERATED_JNI_DIR}
  ${RNS_GENERATED_REACT_DIR}
)

find_package(ReactAndroid REQUIRED CONFIG)

if (ReactAndroid_VERSION_MINOR GREATER_EQUAL 76)
  target_link_libraries(
    react_codegen_rnsvg
    ReactAndroid::reactnative
    ReactAndroid::jsi
  )
else()
  target_link_libraries(
    react_codegen_rnsvg
    folly_runtime
    glog
    jsi
    react_codegen_rncore
    react_debug
    react_nativemodule_core
    react_render_core
    react_render_debug
    react_render_graphics
    react_render_mapbuffer
    rrc_image
    react_render_componentregistry
    rrc_view
    turbomodulejsijni
    yoga
    react_render_imagemanager
    react_utils
  )
endif()
target_link_libraries(
  react_codegen_rnsvg
  fbjni
)

target_compile_options(
  react_codegen_rnsvg
  PRIVATE
  -DLOG_TAG=\"ReactNative\"
  -fexceptions
  -frtti
  -std=c++20
  -Wall
)

target_include_directories(
 ${CMAKE_PROJECT_NAME}
 PUBLIC
 ${CMAKE_CURRENT_SOURCE_DIR}
)
