# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A minimal C++ "Hello, World!" demo built with GN and Ninja. It uses an in-repo GCC/Clang toolchain and a shared `default_flags` config.

## Build system

The project uses [GN](https://gn.googlesource.com/gn/) to generate Ninja files and Ninja to build.

### Prerequisites

- `gn`
- `ninja`
- `python3` (used by GN as `script_executable`)
- A C++ compiler (`c++` on macOS, `g++` on Linux)

### Common commands

Generate build files for the default output directory:

```bash
gn gen out/Default
```

Build the main executable:

```bash
ninja -C out/Default cpp_demo
```

Build all default targets:

```bash
ninja -C out/Default
```

Run the built binary:

```bash
./out/Default/cpp_demo
```

Regenerate after changing `.gn` or `BUILD.gn` files:

```bash
gn gen out/Default
```

### Build configuration

Build arguments are defined in `build/config/compiler_flags.gni` and can be overridden per output directory:

```bash
gn gen out/Debug --args="is_debug=true cpp_optimization_level=0"
gn gen out/Release --args="is_debug=false cpp_optimization_level=3"
```

Key arguments:

- `is_debug` — default `true`. Controls `-g` vs `NDEBUG`.
- `cpp_optimization_level` — default `"2"`. Passed as `-O$cpp_optimization_level`.
- `cpp_extra_cflags`, `cpp_extra_cxxflags`, `cpp_extra_ldflags` — empty by default.

## Architecture

- `main.cpp` — the single source file; builds into the `cpp_demo` executable.
- `BUILD.gn` — root build graph. Defines `//:cpp_demo` plus helper groups `//:root`, `//:default`, and `//:all`.
- `.gn` — GN root metadata; points `buildconfig` to `//build/config/BUILDCONFIG.gn` and sets `root = ":root"`.
- `build/config/BUILDCONFIG.gn` — sets the default toolchain to `//build/toolchain:gcc` and the project name.
- `build/config/BUILD.gn` + `build/config/compiler_flags.gni` — shared compiler/linker flags. Targets should add `configs += [ "//build/config:default_flags" ]` to inherit C++17, `-fno-exceptions`, `-Wall`, `-Wextra`, etc.
- `build/toolchain/` — in-repo GCC toolchain definition (`gcc_toolchain.gni`) wired up in `build/toolchain/BUILD.gn`. On macOS it uses `cc`/`c++`; on Linux it uses `gcc`/`g++`.

## Tests

There is no test runner or test target configured. The `root`, `default`, and `all` groups are marked `testonly` and currently only depend on `:cpp_demo`.
