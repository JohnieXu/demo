#ifndef LYNX_WINDOWS_CMAKE_DEMO_LYNX_SERVICES_H_
#define LYNX_WINDOWS_CMAKE_DEMO_LYNX_SERVICES_H_

#include <memory>

#include "lynx_generic_resource_fetcher.h"
#include "lynx_http_service.h"

class ExampleResourceFetcher : public lynx::pub::LynxGenericResourceFetcher {
 public:
  ExampleResourceFetcher() = default;
  ~ExampleResourceFetcher() override = default;

  void FetchResource(std::shared_ptr<lynx::pub::resource::LynxResourceRequest> request,
					 std::shared_ptr<lynx::pub::resource::LynxResourceResponse> response) override;
};

class LynxHttpServiceImpl : public lynx::pub::LynxHttpService {
 public:
  LynxHttpServiceImpl() = default;
  ~LynxHttpServiceImpl() override = default;

  void Request(std::shared_ptr<lynx::pub::LynxHttpRequest> request,
			   std::shared_ptr<lynx::pub::LynxHttpResponse> response) override;
};

#endif  // LYNX_WINDOWS_CMAKE_DEMO_LYNX_SERVICES_H_
