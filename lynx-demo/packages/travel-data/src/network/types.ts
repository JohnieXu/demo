/**
 * Raw network types (DTO layer)
 *
 * Real API uses { success, errorCode, message, logId, data } wrapper.
 */

export interface ApiResponse<T = unknown> {
  success: boolean
  errorCode: string
  message: string
  logId: string
  data: T
}

export interface ApiErrorDto {
  code: string
  message: string
  logId?: string
  detail?: Record<string, string[]>
}
