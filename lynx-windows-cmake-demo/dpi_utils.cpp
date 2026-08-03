// DPI helpers ported from lynx_explorer (originally from the Flutter embedder).

#include "dpi_utils.h"

namespace {

constexpr UINT kDefaultDpi = 96;

// This is the MDT_EFFECTIVE_DPI value from MONITOR_DPI_TYPE, an enum declared
// in ShellScalingApi.h. Replicating here to avoid importing the library
// directly.
constexpr UINT kEffectiveDpiMonitorType = 0;

template <typename T>
bool AssignProcAddress(HMODULE module, const char* name, T*& outProc) {
  outProc = reinterpret_cast<T*>(GetProcAddress(module, name));
  return *outProc != nullptr;
}

// Abstracts various Windows DPI related functions across Windows OS versions.
class DpiHelperWin32 {
 public:
  DpiHelperWin32() {
    if ((user32_module_ = LoadLibraryA("User32.dll")) != nullptr) {
      dpi_for_window_supported_ =
          AssignProcAddress(user32_module_, "GetDpiForWindow", get_dpi_for_window_);
    }
    if ((shlib_module_ = LoadLibraryA("Shcore.dll")) != nullptr) {
      dpi_for_monitor_supported_ =
          AssignProcAddress(shlib_module_, "GetDpiForMonitor", get_dpi_for_monitor_);
    }
  }

  ~DpiHelperWin32() {
    if (user32_module_ != nullptr) {
      FreeLibrary(user32_module_);
    }
    if (shlib_module_ != nullptr) {
      FreeLibrary(shlib_module_);
    }
  }

  UINT GetDpiForWindow(HWND hwnd) {
    // GetDpiForWindow returns the DPI for any awareness mode. If not available,
    // or no |hwnd| is provided, fallback to a per monitor, system, or default
    // DPI.
    if (dpi_for_window_supported_ && hwnd != nullptr) {
      return get_dpi_for_window_(hwnd);
    }
    if (dpi_for_monitor_supported_) {
      HMONITOR monitor = nullptr;
      if (hwnd != nullptr) {
        monitor = MonitorFromWindow(hwnd, MONITOR_DEFAULTTOPRIMARY);
      }
      return GetDpiForMonitor(monitor);
    }
    HDC hdc = GetDC(hwnd);
    UINT dpi = GetDeviceCaps(hdc, LOGPIXELSX);
    ReleaseDC(hwnd, hdc);
    return dpi;
  }

  UINT GetDpiForMonitor(HMONITOR monitor) {
    if (dpi_for_monitor_supported_) {
      if (monitor == nullptr) {
        const POINT target_point = {0, 0};
        monitor = MonitorFromPoint(target_point, MONITOR_DEFAULTTOPRIMARY);
      }
      UINT dpi_x = 0, dpi_y = 0;
      HRESULT result =
          get_dpi_for_monitor_(monitor, kEffectiveDpiMonitorType, &dpi_x, &dpi_y);
      if (SUCCEEDED(result)) {
        return dpi_x;
      }
    }
    return kDefaultDpi;
  }

 private:
  using GetDpiForWindow_ = UINT __stdcall(HWND);
  using GetDpiForMonitor_ = HRESULT __stdcall(HMONITOR hmonitor, UINT dpiType,
                                              UINT* dpiX, UINT* dpiY);

  GetDpiForWindow_* get_dpi_for_window_ = nullptr;
  GetDpiForMonitor_* get_dpi_for_monitor_ = nullptr;

  HMODULE user32_module_ = nullptr;
  HMODULE shlib_module_ = nullptr;
  bool dpi_for_window_supported_ = false;
  bool dpi_for_monitor_supported_ = false;
};

DpiHelperWin32* GetHelper() {
  static DpiHelperWin32* dpi_helper = new DpiHelperWin32();
  return dpi_helper;
}

}  // namespace

UINT GetDpiForHWND(HWND hwnd) { return GetHelper()->GetDpiForWindow(hwnd); }

UINT GetDpiForMonitor(HMONITOR monitor) {
  return GetHelper()->GetDpiForMonitor(monitor);
}
