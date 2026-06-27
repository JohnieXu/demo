cmake_minimum_required(VERSION 3.20)
project(lynx-macos-demo VERSION 1.0.0 LANGUAGES CXX OBJCXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_OBJCXX_STANDARD 17)
set(CMAKE_OBJCXX_STANDARD_REQUIRED ON)

set(LYNX_LIB_PATH ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/lynx)

if(NOT EXISTS ${LYNX_LIB_PATH})
    message(FATAL_ERROR "LynxSDK not found at ${LYNX_LIB_PATH}. Please download it from https://github.com/lynx-family/lynx/releases")
endif()

include_directories(${LYNX_LIB_PATH}/include)

set(SOURCES
    src/main.mm
    src/AppDelegate.mm
    src/ViewController.mm
    src/ExampleGenericResourceFetcher.mm
)

set(HEADERS
    src/AppDelegate.h
    src/ViewController.h
    src/ExampleGenericResourceFetcher.h
)

add_executable(${PROJECT_NAME} MACOSX_BUNDLE
    ${SOURCES}
    ${HEADERS}
    resources/Info.plist
    resources/flight.lynx.bundle
)

set_source_files_properties(resources/flight.lynx.bundle PROPERTIES
    MACOSX_PACKAGE_LOCATION Resources
)

# Enable ARC for Objective-C/C++ source files
set_target_properties(${PROJECT_NAME} PROPERTIES
    XCODE_ATTRIBUTE_CLANG_ENABLE_OBJC_ARC YES
    OBJCXX_STANDARD 17
    OBJCXX_STANDARD_REQUIRED ON
)

# Non-Xcode generators also need the -fobjc-arc compile flag
if(NOT CMAKE_GENERATOR MATCHES "Xcode")
    foreach(source ${SOURCES})
        set_source_files_properties(${source} PROPERTIES COMPILE_FLAGS "-fobjc-arc")
    endforeach()
endif()

target_link_libraries(${PROJECT_NAME} PRIVATE
    ${LYNX_LIB_PATH}/lib/libLynx.dylib
    "-framework Cocoa"
    "-framework Foundation"
)

set_target_properties(${PROJECT_NAME} PROPERTIES
    MACOSX_BUNDLE_INFO_PLIST ${CMAKE_CURRENT_SOURCE_DIR}/resources/Info.plist
    MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
    MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION}
)

add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND mkdir -p "$<TARGET_BUNDLE_CONTENT_DIR:${PROJECT_NAME}>/Frameworks"
    COMMAND cp "${LYNX_LIB_PATH}/lib/libLynx.dylib" "$<TARGET_BUNDLE_CONTENT_DIR:${PROJECT_NAME}>/Frameworks/"
    COMMAND mkdir -p "$<TARGET_BUNDLE_CONTENT_DIR:${PROJECT_NAME}>/Resources"
    COMMAND cp -R "${LYNX_LIB_PATH}/bundles/" "$<TARGET_BUNDLE_CONTENT_DIR:${PROJECT_NAME}>/Resources/"
    COMMAND cp -R "${LYNX_LIB_PATH}/data/" "$<TARGET_BUNDLE_CONTENT_DIR:${PROJECT_NAME}>/Resources/"
    COMMENT "Copying Lynx library and resources to application bundle"
)

# Also expose the Lynx resource bundles at the Resources root so the desktop loader can find them.
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND cp -R "$<TARGET_BUNDLE_CONTENT_DIR:${PROJECT_NAME}>/Resources/bundles/LynxResources.bundle" "$<TARGET_BUNDLE_CONTENT_DIR:${PROJECT_NAME}>/Resources/" && cp -R "$<TARGET_BUNDLE_CONTENT_DIR:${PROJECT_NAME}>/Resources/bundles/LynxDebugResources.bundle" "$<TARGET_BUNDLE_CONTENT_DIR:${PROJECT_NAME}>/Resources/"
    COMMENT "Flattening Lynx resource bundles into Resources"
)

target_link_options(${PROJECT_NAME} PRIVATE
    "-Wl,-rpath,@executable_path/../Frameworks"
)
