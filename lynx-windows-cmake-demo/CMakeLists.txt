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

# Add source to this project's executable.
add_executable (lynx-windows-cmake-demo WIN32 "lynx-windows-cmake-demo.cpp" "lynx-windows-cmake-demo.h")

if (CMAKE_VERSION VERSION_GREATER 3.12)
  set_property(TARGET lynx-windows-cmake-demo PROPERTY CXX_STANDARD 20)
endif()

# TODO: Add tests and install targets if needed.
