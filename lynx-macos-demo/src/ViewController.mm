#import "ViewController.h"
#import "ExampleGenericResourceFetcher.h"

#import "lynx_env.h"
#import "lynx_http_service.h"
#import "lynx_view.h"

@interface ViewController ()
@end

@implementation ViewController

- (void)loadView {
    self.view = [[NSView alloc] initWithFrame:NSMakeRect(0, 0, 800, 600)];
}

- (void)viewDidLoad {
    [super viewDidLoad];

    lynx::pub::LynxView::Builder builder;
    builder.SetScreenSize(self.view.frame.size.width, self.view.frame.size.height, 1.0)
        .SetFrame(0, 0, self.view.frame.size.width, self.view.frame.size.height)
        .SetParent((__bridge NativeWindow)self.view)
        .SetGenericResourceFetcher(std::make_shared<ExampleGenericResourceFetcher>());
    self.lynxView = builder.Build();

    [self loadTemplate];
}

- (void)viewDidLayout {
    [super viewDidLayout];
    self.lynxView->UpdateScreenMetrics(self.view.frame.size.width, self.view.frame.size.height, 1.0);
    self.lynxView->SetFrame(0, 0, self.view.frame.size.width, self.view.frame.size.height);
}

- (void)loadTemplate {
    auto meta_data = std::make_shared<lynx::pub::LynxLoadMeta>();
    NSURL *bundleURL = [[NSBundle mainBundle] URLForResource:@"flight" withExtension:@"lynx.bundle"];
    meta_data->SetUrl([[bundleURL absoluteString] UTF8String]);
    self.lynxView->LoadTemplate(meta_data);
}

@end
