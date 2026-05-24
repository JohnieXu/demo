/**
 * Functional Result type for domain operations
 *
 * Inspired by Rust Result<T, E> — explicit success/failure without throwing.
 */

export interface Ok<T> {
  readonly isSuccess: true
  readonly isFailure: false
  readonly data: T
}

export interface Err<E> {
  readonly isSuccess: false
  readonly isFailure: true
  readonly error: E
}

export type Result<T, E = DomainError> = Ok<T> | Err<E>

export function ok<T>(data: T): Ok<T> {
  return { isSuccess: true, isFailure: false, data }
}

export function err<E>(error: E): Err<E> {
  return { isSuccess: false, isFailure: true, error }
}

export interface DomainError {
  readonly code: string
  readonly message: string
  readonly cause?: unknown
}
