cmake_minimum_required(VERSION 3.16)

set(RNSVG_VIZIOS_SOURCES
    RNSVGSvgViewProps.cpp
    RNSVGSvgViewShadowNode.cpp
    RNSVGRegistration.cpp
)

add_library(rnsvg_vizios OBJECT ${RNSVG_VIZIOS_SOURCES})

target_include_directories(rnsvg_vizios PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
)

target_link_libraries(rnsvg_vizios
    folly_runtime
    glog
    glog_init
    jsi
    logger
    react_debug
    rrc_view
    react_render_core
    react_render_css
    react_render_debug
    react_render_graphics
    yoga
)

target_compile_reactnative_options(rnsvg_vizios PRIVATE)
