#include "lynx_services.h"

#include <windows.h>
#include <winhttp.h>

#include <fstream>
#include <vector>
#include <string>
#include <algorithm>
#include <cstring>
#include <iterator>
#include <cstdio>
#include <cwctype>

static std::wstring Utf8ToWide(const std::string& s) {
  if (s.empty())
	return std::wstring();
  int required = MultiByteToWideChar(CP_UTF8, 0, s.c_str(), (int)s.size(), nullptr, 0);
  if (required <= 0)
	return std::wstring();
  std::wstring out(required, L'\0');
  MultiByteToWideChar(CP_UTF8, 0, s.c_str(), (int)s.size(), &out[0], required);
  return out;
}

static bool HttpFetch(const std::wstring& wurl, std::vector<uint8_t>& out_body, long& out_status) {
	// Manual URL parsing: extract scheme, host, optional port and path
  std::wstring url_copy = wurl;
  if (url_copy.empty())
	return false;

  // Determine scheme
  bool is_https = false;
  size_t scheme_pos = url_copy.find(L"://");
  if (scheme_pos != std::wstring::npos) {
	std::wstring scheme = url_copy.substr(0, scheme_pos);
	for (wchar_t &c : scheme) c = std::towlower(c);
	if (scheme == L"https")
	  is_https = true;
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
	  if (p > 0 && p <= 0xFFFF)
		port = (INTERNET_PORT)p;
	}
	path_start = (port_end == std::wstring::npos) ? url_copy.size() : port_end;
  }

  // Extract path (including query/fragment)
  std::wstring path;
  if (path_start < url_copy.size())
	path = url_copy.substr(path_start);
  if (path.empty())
	path = L"/";

  DWORD flags = 0;
  if (is_https)
	flags |= WINHTTP_FLAG_SECURE;

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
  if (!hSession)
	return false;

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
	WinHttpCloseHandle(hConnect);
	WinHttpCloseHandle(hSession);
	return false;
  }

  BOOL send_ok = WinHttpSendRequest(hRequest,
									WINHTTP_NO_ADDITIONAL_HEADERS,
									0,
									WINHTTP_NO_REQUEST_DATA,
									0,
									0,
									0);
  if (!send_ok) {
	WinHttpCloseHandle(hRequest);
	WinHttpCloseHandle(hConnect);
	WinHttpCloseHandle(hSession);
	return false;
  }

  if (!WinHttpReceiveResponse(hRequest, nullptr)) {
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

void ExampleResourceFetcher::FetchResource(std::shared_ptr<lynx::pub::resource::LynxResourceRequest> request,
										   std::shared_ptr<lynx::pub::resource::LynxResourceResponse> response) {
  const char* url_c = request->GetUrl();
  std::string url = url_c ? url_c : "";

  const std::string file_scheme = "file://";
  const std::string http_scheme = "http://";
  const std::string https_scheme = "https://";

  if (url.rfind(file_scheme, 0) == 0) {
	// file:// handling (existing behavior)
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
	return;
  }

  if (url.rfind(http_scheme, 0) == 0 || url.rfind(https_scheme, 0) == 0) {
	// HTTP(S) handling using WinHTTP
	std::wstring wurl = Utf8ToWide(url);
	std::vector<uint8_t> body;
	long status = 0;
	bool ok = HttpFetch(wurl, body, status);
	if (!ok) {
	  response->SetCode(-1);
	  response->SetErrorMessage("HTTP fetch failed");
	  response->Complete();
	  return;
	}

	size_t len = body.size();
	uint8_t* data = nullptr;
	if (len > 0) {
	  data = new uint8_t[len];
	  std::memcpy(data, body.data(), len);
	}

	response->SetCode((int)status);
	response->SetData(data, len, +[](uint8_t* p, size_t, void*) { delete[] p; }, nullptr);
	response->Complete();
	return;
  }

  // Unsupported scheme
  response->SetCode(404);
  response->SetErrorMessage("Unsupported URL scheme");
  response->Complete();
}

void LynxHttpServiceImpl::Request(std::shared_ptr<lynx::pub::LynxHttpRequest> request,
								  std::shared_ptr<lynx::pub::LynxHttpResponse> response) {
  (void)request; // ignore request for demo

  const std::string body_str = "Hello from LynxHttpServiceImpl";
  size_t len = body_str.size();
  uint8_t* body = nullptr;
  if (len > 0) {
	body = new uint8_t[len];
	std::memcpy(body, body_str.data(), len);
  }

  response->SetStatusCode(200);
  response->SetStatusText("OK");
  response->AddHeader("Content-Type", "text/plain; charset=utf-8");
  response->SetBody(body, len, +[](uint8_t* p, size_t, void*) { delete[] p; }, nullptr);
  response->Complete();
}
