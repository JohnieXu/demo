#include "lynx_services.h"

#include <windows.h>
#include <winhttp.h>

#include <condition_variable>
#include <cstring>
#include <cstdio>
#include <cwctype>
#include <algorithm>
#include <fstream>
#include <functional>
#include <iterator>
#include <mutex>
#include <queue>
#include <string>
#include <thread>
#include <vector>

// Minimal single-worker background task queue. Used to offload blocking I/O
// (WinHTTP) from the UI thread without pulling in a full thread pool.
class BackgroundTaskQueue {
 public:
  BackgroundTaskQueue() : stop_(false) {
    worker_ = std::thread([this]() { Run(); });
  }

  ~BackgroundTaskQueue() { Shutdown(); }

  void Post(std::function<void()> task) {
    {
      std::lock_guard<std::mutex> lock(mutex_);
      if (stop_) return;
      queue_.push(std::move(task));
    }
    cv_.notify_one();
  }

  void Shutdown() {
    {
      std::lock_guard<std::mutex> lock(mutex_);
      stop_ = true;
    }
    cv_.notify_all();
    if (worker_.joinable()) {
      worker_.join();
    }
  }

 private:
  void Run() {
    while (true) {
      std::function<void()> task;
      {
        std::unique_lock<std::mutex> lock(mutex_);
        cv_.wait(lock, [this]() { return stop_ || !queue_.empty(); });
        if (stop_ && queue_.empty()) return;
        task = std::move(queue_.front());
        queue_.pop();
      }
      if (task) {
        task();
      }
    }
  }

  std::thread worker_;
  std::mutex mutex_;
  std::condition_variable cv_;
  std::queue<std::function<void()>> queue_;
  bool stop_;
};

namespace {

std::wstring Utf8ToWide(const std::string& s) {
  if (s.empty()) return std::wstring();
  int required = MultiByteToWideChar(CP_UTF8, 0, s.c_str(), (int)s.size(), nullptr, 0);
  if (required <= 0) return std::wstring();
  std::wstring out(required, L'\0');
  MultiByteToWideChar(CP_UTF8, 0, s.c_str(), (int)s.size(), &out[0], required);
  return out;
}

bool HttpFetch(const std::wstring& wurl, std::vector<uint8_t>& out_body, long& out_status) {
  // Manual URL parsing: extract scheme, host, optional port and path
  std::wstring url_copy = wurl;
  if (url_copy.empty()) return false;

  // Determine scheme
  bool is_https = false;
  size_t scheme_pos = url_copy.find(L"://");
  if (scheme_pos != std::wstring::npos) {
    std::wstring scheme = url_copy.substr(0, scheme_pos);
    for (wchar_t &c : scheme) c = std::towlower(c);
    if (scheme == L"https") is_https = true;
  }

  // Extract host
  size_t host_start = (scheme_pos == std::wstring::npos) ? 0 : scheme_pos + 3;
  size_t host_end = url_copy.find_first_of(L":/?#", host_start);
  std::wstring host_str;
  if (host_start < url_copy.size()) {
    if (host_end == std::wstring::npos)
      host_str = url_copy.substr(host_start);
    else
      host_str = url_copy.substr(host_start, host_end - host_start);
  }

  // If host extraction failed, output a hex dump around the expected host_start
  if (host_str.empty()) {
    std::wstring hexdbg;
    size_t dump_start = (host_start > 8) ? host_start - 8 : 0;
    size_t dump_end = (url_copy.size() < host_start + 32) ? url_copy.size() : (host_start + 32);
    for (size_t i = dump_start; i < dump_end; ++i) {
      wchar_t buf[8];
      swprintf_s(buf, L"%04x ", (unsigned int)url_copy[i]);
      hexdbg.append(buf);
    }
    wchar_t outdbg[1024];
    swprintf_s(outdbg, L"HttpFetch: host empty; context (hex) start=%zu: %s\n", dump_start, hexdbg.c_str());
    OutputDebugStringW(outdbg);
  }

  // Default port
  INTERNET_PORT port = is_https ? INTERNET_DEFAULT_HTTPS_PORT : INTERNET_DEFAULT_HTTP_PORT;

  // If a port is present, parse it
  size_t path_start = (host_end == std::wstring::npos) ? url_copy.size() : host_end;
  if (host_end != std::wstring::npos && url_copy[host_end] == L':') {
    size_t port_start = host_end + 1;
    size_t port_end = url_copy.find_first_of(L"/;?#", port_start);
    std::wstring port_s;
    if (port_end == std::wstring::npos)
      port_s = url_copy.substr(port_start);
    else
      port_s = url_copy.substr(port_start, port_end - port_start);
    if (!port_s.empty()) {
      long p = wcstol(port_s.c_str(), nullptr, 10);
      if (p > 0 && p <= 0xFFFF) port = (INTERNET_PORT)p;
    }
    path_start = (port_end == std::wstring::npos) ? url_copy.size() : port_end;
  }

  // Extract path (including query/fragment)
  std::wstring path;
  if (path_start < url_copy.size()) path = url_copy.substr(path_start);
  if (path.empty()) path = L"/";

  DWORD flags = 0;
  if (is_https) flags |= WINHTTP_FLAG_SECURE;

  // Debug output to help diagnose invalid URL errors
  {
    wchar_t dbg[1024];
    swprintf_s(dbg, L"HttpFetch: url='%s' host='%s' port=%u path='%s'\n",
               url_copy.c_str(), host_str.c_str(), (unsigned)port, path.c_str());
    OutputDebugStringW(dbg);
  }

  HINTERNET hSession = WinHttpOpen(L"LynxDemo/1.0",
                                   WINHTTP_ACCESS_TYPE_DEFAULT_PROXY,
                                   WINHTTP_NO_PROXY_NAME,
                                   WINHTTP_NO_PROXY_BYPASS,
                                   0);
  if (!hSession) {
    DWORD err = GetLastError();
    wchar_t buf[256];
    swprintf_s(buf, L"WinHttpOpen failed. GetLastError=%u\n", err);
    OutputDebugStringW(buf);
    return false;
  }

  // Limit blocking time so the background worker can eventually shut down.
  DWORD timeout = 30000;  // 30 seconds
  WinHttpSetOption(hSession, WINHTTP_OPTION_RECEIVE_TIMEOUT, &timeout, sizeof(timeout));
  WinHttpSetOption(hSession, WINHTTP_OPTION_SEND_TIMEOUT, &timeout, sizeof(timeout));
  WinHttpSetOption(hSession, WINHTTP_OPTION_CONNECT_TIMEOUT, &timeout, sizeof(timeout));

  HINTERNET hConnect = WinHttpConnect(hSession, host_str.c_str(), port, 0);
  if (!hConnect) {
    DWORD err = GetLastError();
    wchar_t buf[128];
    swprintf_s(buf, L"WinHttpConnect failed. GetLastError=%u\n", err);
    OutputDebugStringW(buf);
    WinHttpCloseHandle(hSession);
    return false;
  }

  HINTERNET hRequest = WinHttpOpenRequest(hConnect,
                                          L"GET",
                                          path.c_str(),
                                          nullptr,
                                          WINHTTP_NO_REFERER,
                                          WINHTTP_DEFAULT_ACCEPT_TYPES,
                                          flags);
  if (!hRequest) {
    DWORD err = GetLastError();
    wchar_t buf[256];
    swprintf_s(buf, L"WinHttpOpenRequest failed. GetLastError=%u\n", err);
    OutputDebugStringW(buf);
    WinHttpCloseHandle(hConnect);
    WinHttpCloseHandle(hSession);
    return false;
  }

  // Follow redirects automatically.
  DWORD redirect_policy = WINHTTP_OPTION_REDIRECT_POLICY_ALWAYS;
  WinHttpSetOption(hRequest, WINHTTP_OPTION_REDIRECT_POLICY, &redirect_policy, sizeof(redirect_policy));

  BOOL send_ok = WinHttpSendRequest(hRequest,
                                    WINHTTP_NO_ADDITIONAL_HEADERS,
                                    0,
                                    WINHTTP_NO_REQUEST_DATA,
                                    0,
                                    0,
                                    0);
  if (!send_ok) {
    DWORD err = GetLastError();
    wchar_t buf[256];
    swprintf_s(buf, L"WinHttpSendRequest failed. GetLastError=%u\n", err);
    OutputDebugStringW(buf);
    WinHttpCloseHandle(hRequest);
    WinHttpCloseHandle(hConnect);
    WinHttpCloseHandle(hSession);
    return false;
  }

  if (!WinHttpReceiveResponse(hRequest, nullptr)) {
    DWORD err = GetLastError();
    wchar_t buf[256];
    swprintf_s(buf, L"WinHttpReceiveResponse failed. GetLastError=%u\n", err);
    OutputDebugStringW(buf);
    WinHttpCloseHandle(hRequest);
    WinHttpCloseHandle(hConnect);
    WinHttpCloseHandle(hSession);
    return false;
  }

  // Get status code
  DWORD status = 0;
  DWORD status_len = sizeof(status);
  if (!WinHttpQueryHeaders(hRequest, WINHTTP_QUERY_STATUS_CODE | WINHTTP_QUERY_FLAG_NUMBER,
                           WINHTTP_HEADER_NAME_BY_INDEX, &status, &status_len, WINHTTP_NO_HEADER_INDEX)) {
    status = -1;
  }
  out_status = (long)status;

  // Read body
  out_body.clear();
  const DWORD kBufferSize = 4096;
  std::vector<uint8_t> buffer(kBufferSize);
  DWORD bytes_read = 0;
  while (WinHttpReadData(hRequest, buffer.data(), kBufferSize, &bytes_read) && bytes_read > 0) {
    out_body.insert(out_body.end(), buffer.begin(), buffer.begin() + bytes_read);
    bytes_read = 0;
  }

  WinHttpCloseHandle(hRequest);
  WinHttpCloseHandle(hConnect);
  WinHttpCloseHandle(hSession);

  return true;
}

}  // namespace

ExampleResourceFetcher::ExampleResourceFetcher()
    : task_queue_(std::make_unique<BackgroundTaskQueue>()) {}

ExampleResourceFetcher::~ExampleResourceFetcher() = default;

void ExampleResourceFetcher::SetOnResponseReadyCallback(OnResponseReadyCallback cb) {
  std::lock_guard<std::mutex> lock(pending_mutex_);
  on_ready_cb_ = std::move(cb);
}

void ExampleResourceFetcher::FetchResource(
    std::shared_ptr<lynx::pub::resource::LynxResourceRequest> request,
    std::shared_ptr<lynx::pub::resource::LynxResourceResponse> response) {
  const char* url_c = request->GetUrl();
  std::string url = url_c ? url_c : "";

  const std::string file_scheme = "file://";
  const std::string http_scheme = "http://";
  const std::string https_scheme = "https://";

  if (url.rfind(file_scheme, 0) == 0) {
    FetchFileSync(request, response);
    return;
  }

  if (url.rfind(http_scheme, 0) == 0 || url.rfind(https_scheme, 0) == 0) {
    FetchHttpAsync(request, response);
    return;
  }

  response->SetCode(404);
  response->SetErrorMessage("Unsupported URL scheme");
  response->Complete();
}

void ExampleResourceFetcher::FetchFileSync(
    std::shared_ptr<lynx::pub::resource::LynxResourceRequest> request,
    std::shared_ptr<lynx::pub::resource::LynxResourceResponse> response) {
  const char* url_c = request->GetUrl();
  std::string url = url_c ? url_c : "";
  const std::string file_scheme = "file://";
  std::string path = url.substr(file_scheme.size());
  std::replace(path.begin(), path.end(), '/', '\\');

  std::ifstream ifs(path, std::ios::binary);
  if (!ifs) {
    response->SetCode(404);
    response->SetErrorMessage("Failed to open file");
    response->Complete();
    return;
  }

  std::vector<uint8_t> buf((std::istreambuf_iterator<char>(ifs)), std::istreambuf_iterator<char>());
  size_t len = buf.size();
  uint8_t* data = nullptr;
  if (len > 0) {
    data = new uint8_t[len];
    std::memcpy(data, buf.data(), len);
  }

  response->SetCode(200);
  response->SetData(data, len, +[](uint8_t* p, size_t, void*) { delete[] p; }, nullptr);
  response->Complete();
}

void ExampleResourceFetcher::FetchHttpAsync(
    std::shared_ptr<lynx::pub::resource::LynxResourceRequest> request,
    std::shared_ptr<lynx::pub::resource::LynxResourceResponse> response) {
  const char* url_c = request->GetUrl();
  std::string url = url_c ? url_c : "";
  lynx_resource_request_id request_id = request->GetRequestId();

  auto cancelled = std::make_shared<std::atomic<bool>>(false);
  {
    std::lock_guard<std::mutex> lock(cancel_mutex_);
    cancel_tokens_[request_id] = cancelled;
  }

  uintptr_t token = 0;
  {
    std::lock_guard<std::mutex> lock(pending_mutex_);
    token = ++next_token_;
    token_to_request_id_[token] = request_id;
  }

  task_queue_->Post([this, url, response, cancelled, request_id, token]() {
    auto cleanup_cancel_token = [this, request_id]() {
      std::lock_guard<std::mutex> lock(cancel_mutex_);
      cancel_tokens_.erase(request_id);
    };

    auto notify_pending = [this, response, token](int code, const std::string& error_message,
                                                  std::vector<uint8_t> body) {
      PendingResponse pending;
      pending.response = response;
      pending.code = code;
      pending.error_message = error_message;
      pending.body = std::move(body);

      OnResponseReadyCallback cb;
      {
        std::lock_guard<std::mutex> lock(pending_mutex_);
        pending_responses_[token] = std::move(pending);
        cb = on_ready_cb_;
      }

      if (cb) {
        cb(token);
      }
    };

    if (cancelled->load()) {
      cleanup_cancel_token();
      notify_pending(-1, "Request cancelled", {});
      return;
    }

    std::wstring wurl = Utf8ToWide(url);
    std::vector<uint8_t> body;
    long status = 0;
    bool ok = HttpFetch(wurl, body, status);

    // Debug: log status and body length to help diagnose blank page / failed loads
    {
      wchar_t dbg_fetch[512];
      swprintf_s(dbg_fetch, L"HttpFetch result: url='%s' ok=%d status=%d body_len=%llu\n",
                 wurl.c_str(), ok ? 1 : 0, (int)status, (unsigned long long)body.size());
      OutputDebugStringW(dbg_fetch);
    }

    if (cancelled->load()) {
      cleanup_cancel_token();
      notify_pending(-1, "Request cancelled", {});
      return;
    }

    cleanup_cancel_token();

    if (!ok) {
      notify_pending(-1, "HTTP fetch failed", {});
      return;
    }

    notify_pending((int)status, "", std::move(body));
  });
}

void ExampleResourceFetcher::Cancel(lynx_resource_request_id request_id) {
  std::lock_guard<std::mutex> lock(cancel_mutex_);
  auto it = cancel_tokens_.find(request_id);
  if (it != cancel_tokens_.end()) {
    it->second->store(true);
    cancel_tokens_.erase(it);
  }
}

void ExampleResourceFetcher::CompleteResponse(uintptr_t token) {
  PendingResponse pending;
  {
    std::lock_guard<std::mutex> lock(pending_mutex_);
    auto it = pending_responses_.find(token);
    if (it == pending_responses_.end()) return;
    pending = std::move(it->second);
    pending_responses_.erase(it);
    token_to_request_id_.erase(token);
  }

  pending.response->SetCode(pending.code);
  if (!pending.error_message.empty()) {
    pending.response->SetErrorMessage(pending.error_message.c_str());
  }

  size_t len = pending.body.size();
  uint8_t* data = nullptr;
  if (len > 0) {
    data = new uint8_t[len];
    std::memcpy(data, pending.body.data(), len);
  }

  pending.response->SetData(data, len, +[](uint8_t* p, size_t, void*) { delete[] p; }, nullptr);
  pending.response->Complete();
}

LynxHttpServiceImpl::LynxHttpServiceImpl()
    : task_queue_(std::make_unique<BackgroundTaskQueue>()) {}

LynxHttpServiceImpl::~LynxHttpServiceImpl() = default;

void LynxHttpServiceImpl::SetOnResponseReadyCallback(OnResponseReadyCallback cb) {
  std::lock_guard<std::mutex> lock(pending_mutex_);
  on_ready_cb_ = std::move(cb);
}

void LynxHttpServiceImpl::Request(std::shared_ptr<lynx::pub::LynxHttpRequest> request,
                                  std::shared_ptr<lynx::pub::LynxHttpResponse> response) {
  (void)request;  // ignore request for demo

  uintptr_t token = 0;
  {
    std::lock_guard<std::mutex> lock(pending_mutex_);
    token = ++next_token_;
  }

  task_queue_->Post([this, response, token]() {
    PendingResponse pending;
    pending.response = response;
    pending.status_code = 200;
    pending.status_text = "OK";
    pending.headers.emplace_back("Content-Type", "text/plain; charset=utf-8");
    const std::string body_str = "Hello from LynxHttpServiceImpl";
    pending.body.assign(body_str.begin(), body_str.end());

    OnResponseReadyCallback cb;
    {
      std::lock_guard<std::mutex> lock(pending_mutex_);
      pending_responses_[token] = std::move(pending);
      cb = on_ready_cb_;
    }

    if (cb) {
      cb(token);
    }
  });
}

void LynxHttpServiceImpl::CompleteResponse(uintptr_t token) {
  PendingResponse pending;
  {
    std::lock_guard<std::mutex> lock(pending_mutex_);
    auto it = pending_responses_.find(token);
    if (it == pending_responses_.end()) return;
    pending = std::move(it->second);
    pending_responses_.erase(it);
  }

  pending.response->SetStatusCode(pending.status_code);
  pending.response->SetStatusText(pending.status_text.c_str());
  for (const auto& header : pending.headers) {
    pending.response->AddHeader(header.first, header.second);
  }

  size_t len = pending.body.size();
  uint8_t* body = nullptr;
  if (len > 0) {
    body = new uint8_t[len];
    std::memcpy(body, pending.body.data(), len);
  }

  pending.response->SetBody(body, len, +[](uint8_t* p, size_t, void*) { delete[] p; }, nullptr);
  pending.response->Complete();
}
