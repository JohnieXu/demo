/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auth DTO ↔ Domain mappers + encryption helpers
 */

'background only'

import {
  GetBasicRequest,
  GetBasicResult,
  Loginv1Request,
  Loginv1Result,
  LogoutResult,
  type DomainError,
  type LoginRequest,
  type LoginResult,
} from 'travel-domain'
import type {
  GetBasicResponseDto,
  LoginPayloadDto,
  LoginResponseDto,
  Loginv1ResponseDto,
  LogoutResponseDto,
  OpenApiEncryptedRequestDto,
  OpenApiGetBasicRequestDto,
  OpenApiLoginv1RequestDto,
} from './dto.js'

/* ─── Constants for the encrypted envelope ──────────────── */

const SYSTEM_ID = '2201'
const API_VERSION = '6.1.5'

/* ─── Encryption helpers (TODO) ─────────────────────────── */

/**
 * TODO: Implement body encryption for the openapi account endpoints.
 *
 * The `body` field of the login request must be the AES/RSA-encrypted
 * JSON payload of { account, password } (or whatever the upstream
 * protocol ends up being). The sign field is derived from the
 * encrypted body together with a shared secret / private key.
 *
 * Once the encryption scheme is finalized, this function should
 * produce the final base64-encoded ciphertext.
 */
function encryptLoginBody(_payload: LoginPayloadDto): string {
  // TODO: replace with real encryption (AES/RSA per server spec)
  return ''
}

/**
 * TODO: Implement sign generation for the encrypted envelope.
 *
 * The sign value is a server-validated checksum that depends on the
 * encrypted body, the timestamp and a shared secret.
 */
function generateSign(
  _encryptedBody: string,
  _timestamp: number
): string {
  // TODO: replace with real signing algorithm
  return ''
}

/* ─── uuid helper ───────────────────────────────────────── */

function generateUuid(): string {
  // RFC 4122 v4-ish uuid; replace with a real uuid lib if available.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/* ─── Reverse mappers: domain → DTO ─────────────────────── */

export function toLoginEncryptedRequestDto(
  request: LoginRequest
): OpenApiEncryptedRequestDto {
  const timestamp = Date.now()
  const payload: LoginPayloadDto = {
    account: request.account,
    password: request.password,
  }
  const encryptedBody = encryptLoginBody(payload)
  const sign = generateSign(encryptedBody, timestamp)

  return {
    systemId: SYSTEM_ID,
    sign,
    version: API_VERSION,
    timestamp,
    uuid: generateUuid(),
    body: encryptedBody,
  }
}

/* ─── Entity mappers: DTO → domain ──────────────────────── */

export function toLoginResult(dto: LoginResponseDto): LoginResult {
  if (!dto.token || !dto.memberId) {
    throw new Error('Login response missing token or memberId')
  }
  return {
    token: dto.token,
    memberId: dto.memberId,
    account: dto.account,
    nickname: dto.nickname,
    phone: dto.phone,
    avatar: dto.avatar,
    extraInfo: dto.extData ?? dto.extraInfo,
  }
}

/**
 * Reverse mappers: domain -> DTO
 */
export function toOpenApiLoginv1RequestDto(request: Loginv1Request): OpenApiLoginv1RequestDto {
  return request
}

/**
 * Entity mappers: DTO -> domain
 */
export function toLoginv1Result(dto: Loginv1ResponseDto): Loginv1Result {
  return dto
}

/**
 * Reverse mappers: domain -> DTO
 */
export function toOpenApiGetBasicRequestDto(request: GetBasicRequest): OpenApiGetBasicRequestDto {
  return request
}

/**
 * Entity mappers: DTO -> domain
 */
export function toGetBasicResult(dto: GetBasicResponseDto): GetBasicResult {
  return dto
}

/**
 * Entity mappers: DTO -> domain
 */
export function toLogoutResult(dto: LogoutResponseDto): LogoutResult {
  return dto
}

/* ─── Error helper ──────────────────────────────────────── */

export function toDomainError(e: unknown): DomainError {
  if (e instanceof Error) {
    return {
      code: 'NETWORK_ERROR',
      message: e.message,
      cause: e,
    }
  }
  return {
    code: 'UNKNOWN_ERROR',
    message: String(e),
    cause: e,
  }
}
