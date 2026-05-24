/**
 * Pagination value objects and types
 */

export interface PageRequest {
  readonly page: number
  readonly pageSize: number
}

export interface PageResult<T> {
  readonly list: readonly T[]
  readonly total: number
  readonly page: number
  readonly pageSize: number
  readonly hasMore: boolean
}

export function createPageResult<T>(
  list: T[],
  total: number,
  page: number,
  pageSize: number
): PageResult<T> {
  return {
    list,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  }
}
