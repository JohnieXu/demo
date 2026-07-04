// lynx-windows-cmake-demo.cpp : Minimal Win32 GUI entry point for the application.

#include "lynx-windows-cmake-demo.h"
#include <windows.h>
#include "lynx_env.h"
#include "lynx_http_service.h"
#include "lynx_view.h"
#include "lynx_generic_resource_fetcher.h"
#include "lynx_services.h"

constexpr UINT WM_LYNX_RESOURCE_COMPLETE = WM_APP + 1;
constexpr UINT WM_LYNX_HTTP_COMPLETE = WM_APP + 2;

struct WindowContext {
	lynx::pub::LynxView* view = nullptr;
	ExampleResourceFetcher* fetcher = nullptr;
	LynxHttpServiceImpl* http_service = nullptr;
};

// Helper: sync a LynxView instance to the current client size of a window.
template <typename T>
static void SyncLynxViewToWindow(HWND hwnd, T* view) {
	RECT rc;
	::GetClientRect(hwnd, &rc);
	int w = rc.right - rc.left;
	int h = rc.bottom - rc.top;
	if (!view) return;
	if constexpr (requires { view->SetFrame(0,0,0,0); }) {
		view->SetFrame(0, 0, w, h);
	} else if constexpr (requires { view->SetSize(0,0); }) {
		view->SetSize(w, h);
	} else if constexpr (requires { view->Resize(0,0); }) {
		view->Resize(w, h);
	}
	if constexpr (requires { view->SetScreenSize(w, h, 1.0); }) {
		view->SetScreenSize(w, h, 2.0);
	}
}

static LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
	switch (msg)
	{
	case WM_SIZE:
	{
		// Retrieve stored context and sync LynxView to new client size.
		auto ctx = reinterpret_cast<WindowContext*>(::GetWindowLongPtr(hwnd, GWLP_USERDATA));
		if (ctx) SyncLynxViewToWindow(hwnd, ctx->view);
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

	HWND hwnd = CreateWindowEx(
		0,
		CLASS_NAME,
		WINDOW_TITLE,
		WS_OVERLAPPEDWINDOW,
		CW_USEDEFAULT, CW_USEDEFAULT, 800, 600,
		NULL, NULL, hInstance, NULL);

	if (!hwnd)
		return 0;

	ShowWindow(hwnd, nCmdShow);
	UpdateWindow(hwnd);

	lynx::pub::LynxView::Builder builder;
	builder.SetScreenSize(800, 600, 2.0)
		.SetFrame(0, 0, 800, 600)
		.SetParent(hwnd);
	// Set Resource fetcher if needed.
	auto fetcher = std::make_shared<ExampleResourceFetcher>();
	builder.SetGenericResourceFetcher(fetcher);
	auto lynx_view = builder.Build();

	WindowContext ctx{};
	ctx.view = lynx_view.get();
	ctx.fetcher = fetcher.get();
	ctx.http_service = http_service.get();

	fetcher->SetOnResponseReadyCallback([hwnd](uintptr_t token) {
		PostMessage(hwnd, WM_LYNX_RESOURCE_COMPLETE, static_cast<WPARAM>(token), 0);
	});

	http_service->SetOnResponseReadyCallback([hwnd](uintptr_t token) {
		PostMessage(hwnd, WM_LYNX_HTTP_COMPLETE, static_cast<WPARAM>(token), 0);
	});

	// store context for WndProc to access
	::SetWindowLongPtr(hwnd, GWLP_USERDATA, reinterpret_cast<LONG_PTR>(&ctx));

	auto load_meta = std::make_shared<lynx::pub::LynxLoadMeta>();
	load_meta->SetUrl("https://lynxjs.org/lynx-examples/hello-world/dist/main.lynx.bundle");
	lynx_view->LoadTemplate(load_meta);

	// helper: sync builder and view to window client size
	auto SyncLynxViewToWindow = [](HWND hwnd, auto& builder, auto* view) {
		RECT rc;
		::GetClientRect(hwnd, &rc);
		int w = rc.right - rc.left;
		int h = rc.bottom - rc.top;
		builder.SetScreenSize(w, h, 2.0).SetFrame(0, 0, w, h);
		if (!view) return;
		if constexpr (requires(decltype(view) v) { v->SetFrame(0, 0, 0, 0); }) {
			view->SetFrame(0, 0, w, h);
		}
		else if constexpr (requires(decltype(view) v) { v->SetSize(0, 0); }) {
			view->SetSize(w, h);
		}
		else if constexpr (requires(decltype(view) v) { v->Resize(0, 0); }) {
			view->Resize(w, h);
		}
		};

	// replace hardcoded size with initial sync
	SyncLynxViewToWindow(hwnd, builder, lynx_view.get());

	MSG msg;
	while (GetMessage(&msg, NULL, 0, 0))
	{
		TranslateMessage(&msg);
		DispatchMessage(&msg);
	}

	return (int)msg.wParam;
}
