// lynx-windows-cmake-demo.cpp : Minimal Win32 GUI entry point for the application.

#include "lynx-windows-cmake-demo.h"
#include <windows.h>
#include <memory>
#include <string>
#include "lynx_env.h"
#include "lynx_http_service.h"
#include "lynx_view.h"
#include "lynx_generic_resource_fetcher.h"
#include "lynx_services.h"
#include "dpi_utils.h"

constexpr UINT WM_LYNX_RESOURCE_COMPLETE = WM_APP + 1;
constexpr UINT WM_LYNX_HTTP_COMPLETE = WM_APP + 2;

struct WindowContext {
	std::unique_ptr<lynx::pub::LynxView> view;
	std::shared_ptr<ExampleResourceFetcher> fetcher;
	std::shared_ptr<LynxHttpServiceImpl> http_service;
	std::string current_url;
};

// Recreate the LynxView and load the given URL. LynxView does not reliably
// reload by calling LoadTemplate on an existing view, so we build a fresh view
// for every (re)load.
static void ReloadLynxView(HWND hwnd, const std::string& url) {
	auto ctx = reinterpret_cast<WindowContext*>(::GetWindowLongPtr(hwnd, GWLP_USERDATA));
	if (!ctx || url.empty()) return;

	ctx->current_url = url;
	ctx->view.reset();

	RECT rc;
	::GetClientRect(hwnd, &rc);
	float dpi = GetDpiForHWND(hwnd) / 96.0f;
	int w = static_cast<int>((rc.right - rc.left) / dpi);
	int h = static_cast<int>((rc.bottom - rc.top) / dpi);

	lynx::pub::LynxView::Builder builder;
	builder.SetScreenSize(w, h, dpi)
	    .SetFrame(0, 0, w, h)
	    .SetParent(hwnd)
	    .SetGenericResourceFetcher(ctx->fetcher);
	ctx->view = builder.Build();

	auto load_meta = std::make_shared<lynx::pub::LynxLoadMeta>();
	load_meta->SetUrl(url);
	ctx->view->LoadTemplate(load_meta);
}

// Simple programmatic modal dialog for entering a URL.
class UrlInputDialog {
 public:
  static bool Show(HWND parent, HINSTANCE instance, std::string& out_url) {
    WNDCLASS wc = {};
    wc.lpfnWndProc = DialogProc;
    wc.hInstance = instance;
    wc.hbrBackground = reinterpret_cast<HBRUSH>(COLOR_BTNFACE + 1);
    wc.lpszClassName = kClassName;
    wc.hCursor = LoadCursor(nullptr, IDC_ARROW);
    RegisterClass(&wc);

    result_ = false;
    out_url_ = &out_url;

    constexpr int kDlgWidth = 480;
    constexpr int kDlgHeight = 120;

    RECT rc;
    GetWindowRect(parent, &rc);
    int x = rc.left + ((rc.right - rc.left) - kDlgWidth) / 2;
    int y = rc.top + ((rc.bottom - rc.top) - kDlgHeight) / 2;

    HWND dlg = CreateWindowEx(
        WS_EX_DLGMODALFRAME, kClassName, "Enter Lynx Bundle URL",
        WS_POPUP | WS_CAPTION | WS_SYSMENU | WS_VISIBLE,
        x, y, kDlgWidth, kDlgHeight,
        parent, nullptr, instance, nullptr);
    if (!dlg) return false;

    EnableWindow(parent, FALSE);

    CreateWindow("STATIC", "URL:",
                  WS_VISIBLE | WS_CHILD | SS_LEFT,
                  10, 14, 30, 20, dlg, nullptr, instance, nullptr);

    HWND edit = CreateWindow(
        "EDIT", nullptr,
        WS_VISIBLE | WS_CHILD | WS_BORDER | WS_TABSTOP | ES_AUTOHSCROLL,
        45, 12, kDlgWidth - 130, 22,
        dlg, reinterpret_cast<HMENU>(static_cast<UINT_PTR>(kEditId)), instance, nullptr);

    SetWindowText(edit, out_url.c_str());

    CreateWindow("BUTTON", "OK",
                  WS_VISIBLE | WS_CHILD | BS_DEFPUSHBUTTON | WS_TABSTOP,
                  kDlgWidth - 120, 50, 50, 24,
                  dlg, reinterpret_cast<HMENU>(static_cast<UINT_PTR>(kOkId)), instance, nullptr);

    CreateWindow("BUTTON", "Cancel",
                  WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON | WS_TABSTOP,
                  kDlgWidth - 60, 50, 50, 24,
                  dlg, reinterpret_cast<HMENU>(static_cast<UINT_PTR>(kCancelId)), instance, nullptr);

    SetFocus(edit);

    MSG msg;
    while (GetMessage(&msg, nullptr, 0, 0)) {
      if (msg.message == WM_KEYDOWN && msg.wParam == VK_RETURN) {
        if (GetFocus() == edit) {
          OnOk(dlg, edit);
          break;
        }
      }
      if (!IsDialogMessage(dlg, &msg)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
      }
    }

    EnableWindow(parent, TRUE);
    DestroyWindow(dlg);
    SetForegroundWindow(parent);
    return result_;
  }

 private:
  static LRESULT CALLBACK DialogProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
      case WM_CREATE:
        return 0;
      case WM_COMMAND:
        if (LOWORD(wParam) == kOkId) {
          HWND edit = GetDlgItem(hwnd, kEditId);
          OnOk(hwnd, edit);
          PostQuitMessage(0);
          return 0;
        }
        if (LOWORD(wParam) == kCancelId) {
          result_ = false;
          PostQuitMessage(0);
          return 0;
        }
        break;
      case WM_CLOSE:
        result_ = false;
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, msg, wParam, lParam);
  }

  static void OnOk(HWND dlg, HWND edit) {
    char buf[2048];
    int len = GetWindowText(edit, buf, 2048);
    if (len > 0) {
      *out_url_ = std::string(buf, len);
      result_ = true;
    } else {
      result_ = false;
    }
  }

  static constexpr LPCTSTR kClassName = "UrlInputDialog";
  static constexpr int kEditId = 100;
  static constexpr int kOkId = IDOK;
  static constexpr int kCancelId = IDCANCEL;

  static inline bool result_ = false;
  static inline std::string* out_url_ = nullptr;
};


// Helper: sync a LynxView instance to the current client size of a window.
// All sizes passed to Lynx are logical units (physical pixels / dpi), matching
// the official lynx_explorer behavior.
static void SyncLynxViewToWindow(HWND hwnd, lynx::pub::LynxView* view) {
	if (!view) return;
	RECT rc;
	::GetClientRect(hwnd, &rc);
	float dpi = GetDpiForHWND(hwnd) / 96.0f;
	float w = (rc.right - rc.left) / dpi;
	float h = (rc.bottom - rc.top) / dpi;
	view->UpdateScreenMetrics(w, h, dpi);
	view->SetFrame(0, 0, w, h);
}

static LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
	switch (msg)
	{
	case WM_DPICHANGED:
	{
		// Resize to the system-suggested rect; the resulting WM_SIZE will
		// sync the LynxView with the new DPI through the unified path.
		auto newRectSize = reinterpret_cast<RECT*>(lParam);
		::SetWindowPos(hwnd, nullptr, newRectSize->left, newRectSize->top,
			newRectSize->right - newRectSize->left,
			newRectSize->bottom - newRectSize->top,
			SWP_NOZORDER | SWP_NOACTIVATE);
		return 0;
	}
	case WM_SIZE:
	{
		// Retrieve stored context and sync LynxView to new client size.
		auto ctx = reinterpret_cast<WindowContext*>(::GetWindowLongPtr(hwnd, GWLP_USERDATA));
		if (ctx && ctx->view) SyncLynxViewToWindow(hwnd, ctx->view.get());
		return 0;
	}
	case WM_LYNX_RESOURCE_COMPLETE:
	{
		auto ctx = reinterpret_cast<WindowContext*>(::GetWindowLongPtr(hwnd, GWLP_USERDATA));
		if (ctx && ctx->fetcher) {
			ctx->fetcher->CompleteResponse(static_cast<uintptr_t>(wParam));
		}
		return 0;
	}
	case WM_LYNX_HTTP_COMPLETE:
	{
		auto ctx = reinterpret_cast<WindowContext*>(::GetWindowLongPtr(hwnd, GWLP_USERDATA));
		if (ctx && ctx->http_service) {
			ctx->http_service->CompleteResponse(static_cast<uintptr_t>(wParam));
		}
		return 0;
	}
	case WM_DESTROY:
		PostQuitMessage(0);
		return 0;
	case WM_KEYDOWN:
	{
		if (GetKeyState(VK_CONTROL) >= 0) break;

		auto ctx = reinterpret_cast<WindowContext*>(::GetWindowLongPtr(hwnd, GWLP_USERDATA));
		if (!ctx) break;

		if (wParam == 'R') {
			ReloadLynxView(hwnd, ctx->current_url);
			return 0;
		}
		if (wParam == 'K') {
			std::string new_url = ctx->current_url;
			HINSTANCE hinst = reinterpret_cast<HINSTANCE>(GetWindowLongPtr(hwnd, GWLP_HINSTANCE));
			if (UrlInputDialog::Show(hwnd, hinst, new_url) && !new_url.empty()) {
				ReloadLynxView(hwnd, new_url);
			}
			return 0;
		}
		break;
	}
	default:
		return DefWindowProc(hwnd, msg, wParam, lParam);
	}
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE /*hPrevInstance*/, LPSTR /*lpCmdLine*/, int nCmdShow)
{
	auto http_service = std::make_shared<LynxHttpServiceImpl>();
	lynx::pub::LynxServiceCenter::GetInstance().RegisterService(http_service);

	auto& lynx_env = lynx::pub::LynxEnv::GetInstance();
	lynx_env.SetDevtoolEnabled(true);
	lynx_env.SetDevtoolAppInfo("App", "Lynx Windows CMake Demo");
	lynx_env.SetDevtoolAppInfo("AppVersion", "1.0.0");

	LPCTSTR CLASS_NAME = "LynxDemoWindowClass";
	LPCTSTR WINDOW_TITLE = "Lynx Windows CMake Demo";

	WNDCLASS wc = {};
	wc.lpfnWndProc = WndProc;
	wc.hInstance = hInstance;
	wc.lpszClassName = CLASS_NAME;
	wc.hCursor = LoadCursor(NULL, IDC_ARROW);
	wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);

	if (!RegisterClass(&wc))
		return 0;

	// Scale the logical 800x600 window size by the primary monitor's DPI, as in
	// lynx_explorer, so the initial client area is 800x600 logical units.
	float initial_dpi = GetDpiForMonitor(nullptr) / 96.0f;
	RECT initial_rect = {0, 0,
		static_cast<LONG>(800 * initial_dpi),
		static_cast<LONG>(600 * initial_dpi)};
	AdjustWindowRect(&initial_rect, WS_OVERLAPPEDWINDOW, FALSE);

	HWND hwnd = CreateWindowEx(
		0,
		CLASS_NAME,
		WINDOW_TITLE,
		WS_OVERLAPPEDWINDOW,
		CW_USEDEFAULT, CW_USEDEFAULT,
		initial_rect.right - initial_rect.left,
		initial_rect.bottom - initial_rect.top,
		NULL, NULL, hInstance, NULL);

	if (!hwnd)
		return 0;

	ShowWindow(hwnd, nCmdShow);
	UpdateWindow(hwnd);

	auto fetcher = std::make_shared<ExampleResourceFetcher>();

	WindowContext ctx{};
	ctx.fetcher = fetcher;
	ctx.http_service = http_service;

	fetcher->SetOnResponseReadyCallback([hwnd](uintptr_t token) {
		PostMessage(hwnd, WM_LYNX_RESOURCE_COMPLETE, static_cast<WPARAM>(token), 0);
	});

	http_service->SetOnResponseReadyCallback([hwnd](uintptr_t token) {
		PostMessage(hwnd, WM_LYNX_HTTP_COMPLETE, static_cast<WPARAM>(token), 0);
	});

	// store context for WndProc to access
	::SetWindowLongPtr(hwnd, GWLP_USERDATA, reinterpret_cast<LONG_PTR>(&ctx));

	ctx.current_url = "http://127.0.0.1:3001/flight.lynx.bundle?fullscreen=true";
	ReloadLynxView(hwnd, ctx.current_url);

	MSG msg;
	while (GetMessage(&msg, NULL, 0, 0))
	{
		TranslateMessage(&msg);
		DispatchMessage(&msg);
	}

	return (int)msg.wParam;
}
