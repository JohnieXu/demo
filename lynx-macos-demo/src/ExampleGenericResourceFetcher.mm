#import <Foundation/Foundation.h>
#import "ExampleGenericResourceFetcher.h"

void ExampleGenericResourceFetcher::FetchResource(std::shared_ptr<lynx::pub::resource::LynxResourceRequest> request, std::shared_ptr<lynx::pub::resource::LynxResourceResponse> response) {
    const char *url_str = request->GetUrl();
    NSString *url_string = [NSString stringWithUTF8String:url_str];
    NSURL *url = [NSURL URLWithString:url_string];

    if ([url.scheme isEqualToString:@"file"]) {
        NSData *data = [NSData dataWithContentsOfURL:url];
        if (data && data.length > 0) {
            response->SetCode(0);
            response->SetData(
                (uint8_t *)data.bytes, data.length,
                [](uint8_t *body, size_t length, void *opaque) { CFRelease(opaque); },
                (__bridge_retained void *)data);
        } else {
            response->SetCode(-1);
            response->SetErrorMessage("Failed to load local file");
        }
        response->Complete();
        return;
    }

    NSMutableURLRequest *nsRequest = [NSMutableURLRequest requestWithURL:url];
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *dataTask =
        [session dataTaskWithRequest:nsRequest
                   completionHandler:^(NSData *_Nullable data, NSURLResponse *_Nullable nsResponse,
                                       NSError *_Nullable error) {
            if (data && data.length > 0) {
                response->SetCode(0);
                response->SetData(
                    (uint8_t *)data.bytes, data.length,
                    [](uint8_t *body, size_t length, void *opaque) { CFRelease(opaque); },
                    (__bridge_retained void *)data);
            } else {
                response->SetCode(-1);
                response->SetErrorMessage("error");
            }
            response->Complete();
        }];

    [dataTask resume];
}
