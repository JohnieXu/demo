/**
 * Auth domain entities
 *
 * Entities and value objects for authentication-related operations.
 * Domain is pure: no HTTP, no encryption, no transport details.
 */

export interface LoginRequest {
  readonly account: string
  readonly password: string
}

export interface LoginResult {
  readonly token: string
  readonly memberId: string
  readonly account?: string
  readonly nickname?: string
  readonly phone?: string
  readonly avatar?: string
  readonly extraInfo?: string
}
