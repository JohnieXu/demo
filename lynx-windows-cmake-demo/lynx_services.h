#ifndef LYNX_WINDOWS_CMAKE_DEMO_LYNX_SERVICES_H_
#define LYNX_WINDOWS_CMAKE_DEMO_LYNX_SERVICES_H_

#include <atomic>
#include <cstdint>
#include <functional>
#include <memory>
#include <mutex>
#include <string>
#include <utility>
#include <unordered_map>
#include <vector>

#include "lynx_generic_resource_fetcher.h"
#include "lynx_http_service.h"

class BackgroundTaskQueue;

class ExampleResourceFetcher : public lynx::pub::LynxGenericResourceFetcher {
 public:
  ExampleResourceFetcher();
  ~ExampleResourceFetcher() override;

  void FetchResource(std::shared_ptr<lynx::pub::resource::LynxResourceRequest> request,
                     std::shared_ptr<lynx::pub::resource::LynxResourceResponse> response) override;

  void Cancel(lynx_resource_request_id request_id) override;

  // Invoked on the background thread when a response has been fetched and is
  // ready to be completed on the UI thread. The receiver should post to the
  // main thread and call CompleteResponse(token) from there.
  using OnResponseReadyCallback = std::function<void(uintptr_t token)>;
  void SetOnResponseReadyCallback(OnResponseReadyCallback cb);

  // Must be called on the UI thread.
  void CompleteResponse(uintptr_t token);

 private:
  struct PendingResponse {
    std::shared_ptr<lynx::pub::resource::LynxResourceResponse> response;
    int code = 0;
    std::string error_message;
    std::vector<uint8_t> body;
  };

  void FetchFileSync(std::shared_ptr<lynx::pub::resource::LynxResourceRequest> request,
                     std::shared_ptr<lynx::pub::resource::LynxResourceResponse> response);

  void FetchHttpAsync(std::shared_ptr<lynx::pub::resource::LynxResourceRequest> request,
                      std::shared_ptr<lynx::pub::resource::LynxResourceResponse> response);

  std::unique_ptr<BackgroundTaskQueue> task_queue_;

  std::mutex cancel_mutex_;
  std::unordered_map<lynx_resource_request_id, std::shared_ptr<std::atomic<bool>>> cancel_tokens_;

  std::mutex pending_mutex_;
  OnResponseReadyCallback on_ready_cb_;
  uintptr_t next_token_ = 0;
  std::unordered_map<uintptr_t, lynx_resource_request_id> token_to_request_id_;
  std::unordered_map<uintptr_t, PendingResponse> pending_responses_;
};

class LynxHttpServiceImpl : public lynx::pub::LynxHttpService {
 public:
  LynxHttpServiceImpl();
  ~LynxHttpServiceImpl() override;

  void Request(std::shared_ptr<lynx::pub::LynxHttpRequest> request,
               std::shared_ptr<lynx::pub::LynxHttpResponse> response) override;

  using OnResponseReadyCallback = std::function<void(uintptr_t token)>;
  void SetOnResponseReadyCallback(OnResponseReadyCallback cb);

  // Must be called on the UI thread.
  void CompleteResponse(uintptr_t token);

 private:
  struct PendingResponse {
    std::shared_ptr<lynx::pub::LynxHttpResponse> response;
    int status_code = 0;
    std::string status_text;
    std::vector<std::pair<std::string, std::string>> headers;
    std::vector<uint8_t> body;
  };

  std::unique_ptr<BackgroundTaskQueue> task_queue_;

  std::mutex pending_mutex_;
  OnResponseReadyCallback on_ready_cb_;
  std::unordered_map<uintptr_t, PendingResponse> pending_responses_;
  uintptr_t next_token_ = 0;
};

#endif  // LYNX_WINDOWS_CMAKE_DEMO_LYNX_SERVICES_H_
