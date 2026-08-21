/**
 * Travel HTTP client based on lynx-shared fetch
 */

'background only'

import { createFetch } from 'lynx-shared'
import type { RequestConfig, LynxResponse } from 'lynx-shared'
import type { ApiResponse } from './types.js'

// Base URL resolution:
// - PUBLIC_TRAVEL_API_URL (from .env / .env.local / .env.[mode] / .env.[mode].local)
//   overrides everything — e.g. `pnpm dev:mock` loads .env.mock which points at the
//   local Koa debug proxy (mock/server.mjs) on port 4000.
// - Otherwise fall back to the real backend (same URL in dev and prod today).
const TRAVEL_API_BASE_URL =
  import.meta.env.PUBLIC_TRAVEL_API_URL || 'https://ts-api.ourtour.com'

export const travelClient = createFetch({
  baseURL: TRAVEL_API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    Locale: 'zh-CN',
  },
})

/* ── interceptors ─────────────────────────────────────────── */

let _authToken: string | null = null

export function setAuthToken(token: string | null) {
  _authToken = token
}

// request: inject auth
travelClient.useRequestInterceptor((config: RequestConfig) => {
  if (_authToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${_authToken}`,
      Logintoken: _authToken,
    }
  }
  return config
})

// response: unwrap {success, errorCode, message, logId, data}
travelClient.useResponseInterceptor((response: LynxResponse<unknown>) => {
  const body = response.data as ApiResponse<unknown> | undefined

  if (body && typeof body === 'object' && 'success' in body && !body.success) {
    const error = new Error(body.message || 'BUSINESS ERROR')
    ;(error as Error & { code: string; logId?: string }).code = body.errorCode
    ;(error as Error & { code: string; logId?: string }).logId = body.logId;
    error.toString = () => {
      return JSON.stringify({
        name: 'BUSINESS ERROR',
        code: body.errorCode,
        message: error.message,
        originalData: body,
      })
    }
    throw error
  }

  if (body && typeof body === 'object' && 'data' in body) {
    return {
      ...response,
      data: body.data,
    } as LynxResponse<unknown>
  }

  return response
})

// error: normalize
travelClient.useErrorInterceptor((error) => {
  const status = error.status
  const data = error.data
  const code = error.code ?? String(status ?? -1)
  const enhanced = new Error(
    error.message || 'Network error'
  ) as Error & { code: string; detail?: unknown }
  enhanced.code = code
  enhanced.detail = data
  throw enhanced
})
