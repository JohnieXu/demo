/**
 * Travel HTTP client based on lynx-shared fetch
 */

'background only'

import { createFetch } from 'lynx-shared'
import type { RequestConfig, LynxResponse } from 'lynx-shared'
import type { ApiResponse } from './types.js'

const TRAVEL_API_BASE_URL = import.meta.env.DEV ? 'https://ts-api.ourtour.com' : 'https://ts-api.ourtour.com'

export const travelClient = createFetch({
  baseURL: TRAVEL_API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
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
    }
  }
  return config
})

// response: unwrap {success, errorCode, message, logId, data}
travelClient.useResponseInterceptor((response: LynxResponse<unknown>) => {
  const body = response.data as ApiResponse<unknown> | undefined

  if (body && typeof body === 'object' && 'success' in body && !body.success) {
    const error = new Error(body.message || 'Business error')
    ;(error as Error & { code: string; logId?: string }).code = body.errorCode
    ;(error as Error & { code: string; logId?: string }).logId = body.logId
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
