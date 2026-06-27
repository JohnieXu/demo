#import "AppDelegate.h"
#import "ViewController.h"

#import "lynx_env.h"
#import "lynx_http_service.h"
#import "lynx_view.h"

// Implements the http service if needed.
class LynxHttpServiceImpl : public lynx::pub::LynxHttpService {
public:
    LynxHttpServiceImpl() = default;
    ~LynxHttpServiceImpl() = default;
    void Request(std::shared_ptr<lynx::pub::LynxHttpRequest> request, std::shared_ptr<lynx::pub::LynxHttpResponse> response) override {
        // TODO: implement HTTP request handling if lynx.fetch is used
        response->SetStatusCode(-1);
        response->SetStatusText("Not implemented");
        response->Complete();
    }
};

@interface AppDelegate ()
@end

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
    // Register http service for lynx.fetch
    lynx::pub::LynxServiceCenter::GetInstance().RegisterService(std::make_shared<LynxHttpServiceImpl>());

    // Initialize LynxEnv
    auto& lynx_env = lynx::pub::LynxEnv::GetInstance();
    // Enable devtool
    lynx_env.SetDevtoolEnabled(true);
    lynx_env.SetDevtoolAppInfo("App", "LynxExplorer");
    lynx_env.SetDevtoolAppInfo("AppVersion", "1.0.0");
    // Register global native module if needed
    // lynx_env.RegisterNativeModule("ExplorerModule", ExplorerModuleCreator, nullptr);

    // Create main window
    NSRect frame = NSMakeRect(100, 100, 800, 600);
    NSWindow *window = [[NSWindow alloc] initWithContentRect:frame
                                                   styleMask:(NSWindowStyleMaskTitled |
                                                              NSWindowStyleMaskClosable |
                                                              NSWindowStyleMaskResizable |
                                                              NSWindowStyleMaskMiniaturizable)
                                                     backing:NSBackingStoreBuffered
                                                       defer:NO];
    self.window = window;
    [window setTitle:@"Lynx macOS Demo"];
    [window makeKeyAndOrderFront:nil];
    [NSApp activateIgnoringOtherApps:YES];

    ViewController *viewController = [[ViewController alloc] init];
    [window setContentViewController:viewController];
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)sender {
    return YES;
}

@end
