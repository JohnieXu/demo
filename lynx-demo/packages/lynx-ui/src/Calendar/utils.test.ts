import { describe, expect, it } from 'vitest'

import { parseSize, toCSSSize } from './utils'

describe('Calendar utils', () => {
  describe('parseSize', () => {
    it('returns number as-is', () => {
      expect(parseSize(64)).toBe(64)
      expect(parseSize(100)).toBe(100)
    })

    it('parses px string to number', () => {
      expect(parseSize('64px')).toBe(64)
      expect(parseSize('100px')).toBe(100)
    })
  })

  describe('toCSSSize', () => {
    it('formats number as px string', () => {
      expect(toCSSSize(64)).toBe('64px')
      expect(toCSSSize(100)).toBe('100px')
    })

    it('formats px string as px string', () => {
      expect(toCSSSize('64px')).toBe('64px')
      expect(toCSSSize('100px')).toBe('100px')
    })
  })
})
