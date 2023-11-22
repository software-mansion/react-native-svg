cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

file(GLOB rnoh_svg_SRC CONFIGURE_DEPENDS *.cpp)
add_library(rnoh_svg SHARED ${rnoh_svg_SRC})
target_include_directories(rnoh_svg PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(rnoh_svg PUBLIC rnoh)