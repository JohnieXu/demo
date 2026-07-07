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
    void Request(std::shared_ptr<lynx::pub::LynxHttpRequest> request,
                 std::shared_ptr<lynx::pub::LynxHttpResponse> resp) override {
        NSURL *url = [NSURL URLWithString:[NSString stringWithUTF8String:request->GetUrl().c_str()]];
        NSMutableURLRequest *nsRequest = [NSMutableURLRequest requestWithURL:url];
        nsRequest.HTTPMethod = [NSString stringWithUTF8String:request->GetMethod().c_str()];

        const auto& headers = request->GetHeaders();
        for (const auto& header : headers) {
            [nsRequest setValue:[NSString stringWithUTF8String:header.second.c_str()]
             forHTTPHeaderField:[NSString stringWithUTF8String:header.first.c_str()]];
        }

        const auto& body = request->GetBody();
        if (!body.empty()) {
            nsRequest.HTTPBody = [NSData dataWithBytes:body.data() length:body.size()];
        }

        NSURLSession *session = [NSURLSession sharedSession];
        NSURLSessionDataTask *dataTask =
            [session dataTaskWithRequest:nsRequest
                       completionHandler:^(NSData *_Nullable data, NSURLResponse *_Nullable response,
                                           NSError *_Nullable error) {
                         if (data && data.length > 0) {
                             resp->SetBody(
                                 (uint8_t *)data.bytes, data.length,
                                 [](uint8_t *body, size_t length, void *opaque) { CFRelease(opaque); },
                                 (__bridge_retained void *)data);
                         }
                         if (error) {
                             static const int SDK_ERROR_STATUS_CODE = 499;
                             resp->SetStatusCode(SDK_ERROR_STATUS_CODE);
                             resp->SetStatusText([error.localizedDescription UTF8String]);
                         } else {
                             NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
                             resp->SetStatusCode(httpResponse.statusCode);
                             resp->SetStatusText("OK");
                             for (NSString *key in httpResponse.allHeaderFields) {
                                 NSString *value = httpResponse.allHeaderFields[key];
                                 if (key && value) {
                                     resp->AddHeader([key UTF8String], [value UTF8String]);
                                 }
                             }
                         }
                         resp->Complete();
                       }];

        [dataTask resume];
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
