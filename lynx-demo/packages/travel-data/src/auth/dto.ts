/**
 * Auth data-transfer objects (backend JSON shapes)
 */

/* ─── Plain (domain-side) login payload ─────────────────── */

/** Inner login payload that will be encrypted into the `body` field. */
export interface LoginPayloadDto {
  account: string
  password: string
}

/* ─── Encrypted request envelope ────────────────────────── */

export interface OpenApiEncryptedRequestDto {
  systemId: string
  sign: string
  version: string
  timestamp: number
  uuid: string
  body: string
}

/* ─── Login response ────────────────────────────────────── */

export interface LoginResponseDto {
  token?: string
  memberId?: string
  account?: string
  nickname?: string
  phone?: string
  avatar?: string
  extData?: string
  extraInfo?: string
}
