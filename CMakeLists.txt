cmake_minimum_required(VERSION 3.20)

# --- react-native-svg ViziOS implementation OBJECT library ---

set(RNSVG_VIZIOS_SOURCES
    vizios/RNSVGCommonProps.cpp
    vizios/RNSVGSvgViewProps.cpp
    vizios/RNSVGSvgViewShadowNode.cpp
    vizios/RNSVGRenderableProps.cpp
    vizios/RNSVGGroupProps.cpp
    vizios/RNSVGPathProps.cpp
    vizios/RNSVGRectProps.cpp
    vizios/RNSVGCircleProps.cpp
    vizios/RNSVGLineProps.cpp
    vizios/RNSVGEllipseProps.cpp
    vizios/RNSVGDefsProps.cpp
    vizios/RNSVGClipPathProps.cpp
    vizios/RNSVGLinearGradientProps.cpp
    vizios/RNSVGRadialGradientProps.cpp
    vizios/RNSVGShadowNodes.cpp
    vizios/RNSVGRegistration.cpp
)

add_library(rnsvg_vizios OBJECT ${RNSVG_VIZIOS_SOURCES})

target_include_directories(rnsvg_vizios PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/vizios
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
