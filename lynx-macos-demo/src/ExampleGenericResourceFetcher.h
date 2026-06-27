#import <Foundation/Foundation.h>
#import "lynx_generic_resource_fetcher.h"

class ExampleGenericResourceFetcher : public lynx::pub::LynxGenericResourceFetcher {
public:
    void FetchResource(std::shared_ptr<lynx::pub::resource::LynxResourceRequest> request, std::shared_ptr<lynx::pub::resource::LynxResourceResponse> response) override;
};
