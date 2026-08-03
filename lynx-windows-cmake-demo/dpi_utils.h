// DPI helpers ported from lynx_explorer (originally from the Flutter embedder).

#pragma once

#include <Windows.h>

// Returns the DPI for |hwnd|. Supports all DPI awareness modes, and is
// backward compatible down to Windows Vista. If |hwnd| is nullptr, returns the
// DPI for the primary monitor. If Per-Monitor DPI awareness is not available,
// returns the system's DPI.
UINT GetDpiForHWND(HWND hwnd);

// Returns the DPI of a given monitor. Defaults to 96 if the API is not
// available.
UINT GetDpiForMonitor(HMONITOR monitor);
