/**
 * Fetch API encapsulation for Lynx applications
 *
 * Note: fetch is only available on the background thread.
 * This module should only be imported in background-only contexts.
 */

import type { Request, RequestInit, Response } from '@lynx-js/types/background';

/** Lynx fetch function typed from @lynx-js/types instead of DOM lib */
function getFetch(): (
  input: string | Request | URL,
  init?: RequestInit,
) => Promise<Response> {
  if (typeof fetch === 'undefined') {
    throw new Error('fetch is only available on the background thread');
  }
  return fetch as unknown as (
    input: string | Request | URL,
    init?: RequestInit,
  ) => Promise<Response>;
}

type LynxRequestInfo = string | Request | URL;

export interface RequestConfig extends Omit<RequestInit, 'body'> {
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Base URL prepended to the request URL */
  baseURL?: string;
  /** Request body (object will be JSON-stringified) */
  data?: Record<string, unknown> | string | ArrayBuffer;
  /** URL query parameters */
  params?: Record<string, string | number | boolean | undefined>;
}

export interface LynxResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export type Interceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor = (response: LynxResponse) => LynxResponse | Promise<LynxResponse>;
export type ErrorInterceptor = (error: LynxFetchError) => LynxResponse | Promise<LynxResponse>;

export class LynxFetchError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string,
    public data?: unknown,
    public config?: RequestConfig,
    public code?: string,
  ) {
    super(message);
    this.name = 'LynxFetchError';
  }
}

function buildURL(url: string, baseURL?: string, params?: Record<string, string | number | boolean | undefined>): string {
  let fullUrl = baseURL ? `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}` : url;

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const separator = fullUrl.includes('?') ? '&' : '?';
    fullUrl += separator + searchParams.toString();
  }

  return fullUrl;
}

function buildHeaders(config: RequestConfig): Record<string, string> {
  const headers: Record<string, string> = {};

  if (config.data && typeof config.data === 'object' && !(config.data instanceof ArrayBuffer)) {
    headers['Content-Type'] = 'application/json';
  }

  if (config.headers) {
    if (config.headers instanceof Headers) {
      config.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(config.headers)) {
      config.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, config.headers as Record<string, string>);
    }
  }

  return headers;
}

function buildBody(config: RequestConfig): string | ArrayBuffer | undefined {
  if (!config.data) return undefined;

  if (typeof config.data === 'string' || config.data instanceof ArrayBuffer) {
    return config.data;
  }

  return JSON.stringify(config.data);
}

async function timeoutFetch(input: LynxRequestInfo, init?: RequestInit & { timeout?: number }): Promise<Response> {
  const { timeout = 30000, ...requestInit } = init || {};

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new LynxFetchError(`Request timeout after ${timeout}ms`));
    }, timeout);

    console.log('fetch with input config', input, requestInit);

    getFetch()(input, requestInit)
      .then((response) => {
        console.log('fetch response', response);
        if (response.json) {
          response.json().then((data) => {
            console.log('fetch response data', data);
          })
        }
        clearTimeout(timer);
        resolve(response);
      })
      .catch((error) => {
        console.log('fetch error', error);
        clearTimeout(timer);
        reject(error instanceof Error ? error : new LynxFetchError(String(error)));
      });
  });
}

async function parseResponse<T>(response: Response): Promise<LynxResponse<T>> {
  const contentType = response.headers.get('content-type') || '';
  let data: T;

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text() as unknown as T;
  }

  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers,
  };
}

/**
 * Create a configured fetch instance
 */
export function createFetch(defaultConfig: RequestConfig = {}) {
  'background only';
  const requestInterceptors: Interceptor[] = [];
  const responseInterceptors: ResponseInterceptor[] = [];
  const errorInterceptors: ErrorInterceptor[] = [];

  async function request<T = unknown>(url: string, config: RequestConfig = {}): Promise<LynxResponse<T>> {
    let mergedConfig: RequestConfig = {
      ...defaultConfig,
      ...config,
      headers: {
        ...(defaultConfig.headers || {}),
        ...(config.headers || {}),
      },
    };

    // Run request interceptors
    for (const interceptor of requestInterceptors) {
      mergedConfig = await interceptor(mergedConfig);
    }

    // debugger

    const fullUrl = buildURL(url, mergedConfig.baseURL, mergedConfig.params);
    const headers = buildHeaders(mergedConfig);
    const body = buildBody(mergedConfig);

    const init: RequestInit & { timeout?: number } = {
      ...mergedConfig,
      headers,
      body,
      timeout: mergedConfig.timeout ?? defaultConfig.timeout ?? 30000,
    };

    try {
      const response = await timeoutFetch(fullUrl, init);
      let parsedResponse = await parseResponse<T>(response);

      if (!response.ok) {
        throw new LynxFetchError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response.statusText,
          parsedResponse.data,
          mergedConfig,
        );
      }

      // Run response interceptors
      for (const interceptor of responseInterceptors) {
        parsedResponse = (await interceptor(parsedResponse)) as LynxResponse<T>;
      }

      return parsedResponse;
    } catch (error) {
      const lynxError = error instanceof LynxFetchError
        ? error
        : new LynxFetchError(
            error instanceof Error ? error.message : String(error),
            undefined,
            undefined,
            undefined,
            mergedConfig,
            (error as { code?: string }).code,
          );

      // Run error interceptors
      for (const interceptor of errorInterceptors) {
        try {
          return (await interceptor(lynxError)) as LynxResponse<T>;
        } catch {
          // Continue to next interceptor if this one throws
        }
      }

      throw lynxError;
    }
  }

  return {
    request,

    get<T = unknown>(url: string, config?: Omit<RequestConfig, 'data' | 'method'>): Promise<LynxResponse<T>> {
      return request<T>(url, { ...config, method: 'GET' });
    },

    post<T = unknown>(url: string, data?: RequestConfig['data'], config?: Omit<RequestConfig, 'data' | 'method'>): Promise<LynxResponse<T>> {
      return request<T>(url, { ...config, method: 'POST', data });
    },

    put<T = unknown>(url: string, data?: RequestConfig['data'], config?: Omit<RequestConfig, 'data' | 'method'>): Promise<LynxResponse<T>> {
      return request<T>(url, { ...config, method: 'PUT', data });
    },

    patch<T = unknown>(url: string, data?: RequestConfig['data'], config?: Omit<RequestConfig, 'data' | 'method'>): Promise<LynxResponse<T>> {
      return request<T>(url, { ...config, method: 'PATCH', data });
    },

    delete<T = unknown>(url: string, config?: Omit<RequestConfig, 'method'>): Promise<LynxResponse<T>> {
      return request<T>(url, { ...config, method: 'DELETE' });
    },

    useRequestInterceptor(interceptor: Interceptor) {
      requestInterceptors.push(interceptor);
      return () => {
        const index = requestInterceptors.indexOf(interceptor);
        if (index > -1) requestInterceptors.splice(index, 1);
      };
    },

    useResponseInterceptor(interceptor: ResponseInterceptor) {
      responseInterceptors.push(interceptor);
      return () => {
        const index = responseInterceptors.indexOf(interceptor);
        if (index > -1) responseInterceptors.splice(index, 1);
      };
    },

    useErrorInterceptor(interceptor: ErrorInterceptor) {
      errorInterceptors.push(interceptor);
      return () => {
        const index = errorInterceptors.indexOf(interceptor);
        if (index > -1) errorInterceptors.splice(index, 1);
      };
    },
  };
}

/** Default fetch instance */
export const lynxFetch = createFetch();

export default lynxFetch;
