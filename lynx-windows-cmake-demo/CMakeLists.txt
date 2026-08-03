# CMakeList.txt : CMake project for lynx-windows-cmake-demo, include source and define
# project specific logic here.
#
cmake_minimum_required (VERSION 3.10)

# Enable Hot Reload for MSVC compilers if supported.
if (POLICY CMP0141)
  cmake_policy(SET CMP0141 NEW)
  set(CMAKE_MSVC_DEBUG_INFORMATION_FORMAT "$<IF:$<AND:$<C_COMPILER_ID:MSVC>,$<CXX_COMPILER_ID:MSVC>>,$<$<CONFIG:Debug,RelWithDebInfo>:EditAndContinue>,$<$<CONFIG:Debug,RelWithDebInfo>:ProgramDatabase>>")
endif()

project ("lynx-windows-cmake-demo")

# Set the C++ standard to at least 17 if you are using the C++ wrapper apis of LynxSDK.
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(LYNX_LIB_PATH ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/lynx) # Or your location of LynxSDK
# Set include directory of LynxSDK.
include_directories(${LYNX_LIB_PATH}/include)

# Add source to this project's executable. The .manifest file is embedded by the
# linker and declares PerMonitorV2 DPI awareness.
add_executable (lynx-windows-cmake-demo WIN32 "lynx-windows-cmake-demo.cpp" "lynx-windows-cmake-demo.h" "lynx_services.cpp" "lynx_services.h" "dpi_utils.cpp" "dpi_utils.h" "app.manifest")

if (CMAKE_VERSION VERSION_GREATER 3.12)
  set_property(TARGET lynx-windows-cmake-demo PROPERTY CXX_STANDARD 20)
endif()

# Link LynxSDK import library after the target is created
target_link_libraries(${PROJECT_NAME} PRIVATE ${LYNX_LIB_PATH}/lib/lynx.dll.lib winhttp)

# TODO: Add tests and install targets if needed.

# 拷贝 lynx.dll 到输出目录
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
        ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/lynx/lib/lynx.dll
        $<TARGET_FILE_DIR:${PROJECT_NAME}>)
# 拷贝 data 到输出目录
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
        ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/lynx/data
        $<TARGET_FILE_DIR:${PROJECT_NAME}>/data)
# 拷贝 lynx_core.js 到输出目录
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
        ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/lynx/lynx_core.js
        $<TARGET_FILE_DIR:${PROJECT_NAME}>)
# 拷贝 lynx_core_dev.js 到输出目录
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
        ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/lynx/lynx_core_dev.js
        $<TARGET_FILE_DIR:${PROJECT_NAME}>)
