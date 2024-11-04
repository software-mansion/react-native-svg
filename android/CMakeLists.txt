cmake_minimum_required(VERSION 3.9.0)

project(rnsvg)

add_library(rnsvg
    SHARED
    ./src/main/cpp/jni-adapter.cpp
)

set_target_properties(rnsvg PROPERTIES
    CXX_STANDARD 20
    CXX_STANDARD_REQUIRED ON
    CXX_EXTENSIONS OFF
    POSITION_INDEPENDENT_CODE ON
)

find_package(ReactAndroid REQUIRED CONFIG)

target_link_libraries(rnsvg
    android
    jnigraphics
)
