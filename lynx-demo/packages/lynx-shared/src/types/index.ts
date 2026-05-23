/**
 * Common type utilities
 */

/**
 * Make specific properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Make specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Nullable type shorthand
 */
export type Nullable<T> = T | null | undefined;

/**
 * Generic callback type
 */
export type Callback<T = void> = () => T;

/**
 * Generic async function type
 */
export type AsyncFn<T = void, Args extends unknown[] = []> = (...args: Args) => Promise<T>;

/**
 * Lynx event with detail
 */
export interface LynxEventDetail<T = unknown> {
  detail: T;
}
