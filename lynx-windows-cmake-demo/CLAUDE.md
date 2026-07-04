# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is a minimal Windows desktop C++ application that embeds the Lynx rendering engine via the LynxSDK. It creates a Win32 window, constructs a `lynx::pub::LynxView`, and loads a remote Lynx bundle.

## Build system

The project uses **CMake** with **CMakePresets.json** configured for Windows/MSVC/Ninja builds. Presets require a Visual Studio environment (`VSINSTALLDIR`) because they set `CMAKE_PROJECT_TOP_LEVEL_INCLUDES` to the SegmentHeap module shipped with VS.

### Available presets

- `x64-debug`
- `x64-release`
- `x86-debug`
- `x86-release`

### Building from the command line

Open a **Developer Command Prompt for VS** (or otherwise ensure `cl.exe` and `VSINSTALLDIR` are available), then run:

```powershell
cmake --preset x64-debug
cmake --build out/build/x64-debug
```

For a release build:

```powershell
cmake --preset x64-release
cmake --build out/build/x64-release
```

### Building from Visual Studio

The repository contains a `.vs` solution workspace. Opening the folder in Visual Studio with the CMake workload installed will pick up `CMakePresets.json` automatically.

### Runtime dependencies

The build copies the following from `thirdparty/lynx/` to the executable output directory as post-build steps:

- `lib/lynx.dll`
- `data/` (recursive copy)
- `lynx_core.js`
- `lynx_core_dev.js`

The executable links against `thirdparty/lynx/lib/lynx.dll.lib` and `winhttp`.

## Project layout

| File | Purpose |
|------|---------|
| `lynx-windows-cmake-demo.cpp` | `WinMain`, window class registration, message loop, `LynxView` construction and initial load. |
| `lynx-windows-cmake-demo.h` | Shared header / standard includes. |
| `lynx_services.cpp` / `.h` | Service implementations registered with the Lynx runtime: `ExampleResourceFetcher` and `LynxHttpServiceImpl`. |
| `thirdparty/lynx/` | LynxSDK headers, import library, runtime DLL, and core JS bundles. |
| `CMakeLists.txt` | Build definition; sets C++17/20, include directories, links LynxSDK, and defines the post-build copy commands. |
| `CMakePresets.json` | Ninja + MSVC presets for x64/x86 Debug/Release. |

## Architecture

### Application entry point

`WinMain` in `lynx-windows-cmake-demo.cpp`:

1. Registers `LynxHttpServiceImpl` with the global `LynxServiceCenter`.
2. Configures `LynxEnv` (enables devtools and sets app metadata).
3. Creates a standard Win32 overlapped window.
4. Builds a `lynx::pub::LynxView` through `LynxView::Builder`, passing the window handle as the parent and installing `ExampleResourceFetcher` as the generic resource fetcher.
5. Loads a remote template bundle with `LynxLoadMeta::SetUrl`.
6. Runs the message loop.

### Window resizing

The raw `LynxView*` is stored in `GWLP_USERDATA` of the HWND. `WndProc` handles `WM_SIZE` by reading that pointer and calling `SyncLynxViewToWindow`, which tries `SetFrame`, `SetSize`, and `Resize` in order of availability. A similar helper is used for the initial sync.

### Services

Lynx services are registered by implementing SDK interfaces and registering shared instances with `LynxServiceCenter::RegisterService` before the view is built.

- **`ExampleResourceFetcher`** (`lynx_services.h/.cpp`): implements `lynx::pub::LynxGenericResourceFetcher`. Handles `file://` URLs locally and `http://`/`https://` URLs through WinHTTP. Converts fetched data into `LynxResourceResponse` buffers with a deleter that uses `delete[]`.
- **`LynxHttpServiceImpl`** (`lynx_services.h/.cpp`): implements `lynx::pub::LynxHttpService`. Currently ignores the request and returns a hardcoded plain-text body for demo purposes.

### SDK dependencies

The LynxSDK is consumed as a prebuilt third-party dependency under `thirdparty/lynx/`. Key headers used:

- `lynx_env.h`
- `lynx_view.h`
- `lynx_http_service.h`
- `lynx_generic_resource_fetcher.h`
- `lynx_service_center.h`

The project requires **C++17** at minimum (the LynxSDK C++ wrapper APIs expect it). CMake 3.12+ sets the target standard to **C++20**.

## Development notes

- There are currently **no automated tests** and **no linting configuration** in this repository.
- To run the application after building, execute the produced `.exe` from its output directory so that `lynx.dll`, `data/`, and the `lynx_core*.js` files are present.
- The default bundle URL is `https://lynxjs.org/lynx-examples/hello-world/dist/main.lynx.bundle`. Change it in `lynx-windows-cmake-demo.cpp` if you want to load a different bundle.
