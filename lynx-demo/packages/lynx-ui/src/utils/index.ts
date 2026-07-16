// Shared utilities for lynx-ui components, ported from vant conventions.

import type { CSSProperties } from '@lynx-js/types'

export type Numeric = number | string

export function isDef<T>(val: T): val is NonNullable<T> {
  return val !== undefined && val !== null
}

export function isObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === 'object'
}

export function isFunction(val: unknown): val is (...args: unknown[]) => unknown {
  return typeof val === 'function'
}

export function isPromise<T = unknown>(val: unknown): val is Promise<T> {
  return (
    isObject(val) &&
    'then' in val &&
    'catch' in val &&
    isFunction((val as { then: unknown }).then) &&
    isFunction((val as { catch: unknown }).catch)
  )
}

export function isNumeric(val: unknown): val is number | string {
  return typeof val === 'number' || /^\d+(\.\d+)?$/.test(String(val))
}

export function toNumber(val?: Numeric): number {
  if (!isDef(val)) return 0
  const num = Number(val)
  return Number.isNaN(num) ? 0 : num
}

export function addUnit(value?: Numeric): string | undefined {
  if (!isDef(value)) return undefined
  return isNumeric(value) ? `${value}px` : String(value)
}

export function getSizeStyle(originSize?: Numeric | Numeric[]): CSSProperties | undefined {
  if (isDef(originSize)) {
    if (Array.isArray(originSize)) {
      return {
        width: addUnit(originSize[0]),
        height: addUnit(originSize[1]),
      }
    }
    const size = addUnit(originSize)
    return {
      width: size,
      height: size,
    }
  }
  return undefined
}

export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max)
}

export function padZero(num: number | string, targetLength = 2): string {
  let str = String(num)
  while (str.length < targetLength) {
    str = `0${str}`
  }
  return str
}

export function noop(): void {
  // do nothing
}

export function toArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item]
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce(
    (ret, key) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        ret[key] = obj[key]
      }
      return ret
    },
    {} as Pick<T, K>,
  )
}

export type BEM = (
  element?: string | Record<string, boolean>,
  modifier?: Record<string, boolean>,
) => string

export function createNamespace(name: string): BEM {
  const prefix = `lu-${name}`
  return (element?: string | Record<string, boolean>, modifier?: Record<string, boolean>) => {
    let base = prefix
    if (typeof element === 'string') {
      base = `${prefix}__${element}`
    } else if (isObject(element)) {
      modifier = element
    }

    if (!modifier) return base

    const mods = Object.entries(modifier)
      .filter(([, value]) => value)
      .map(([key]) => `${base}--${key}`)

    return mods.length ? `${base} ${mods.join(' ')}` : base
  }
}

// Simple count-down hook used by CountDown component.
export interface UseCountDownOptions {
  time: number
  millisecond?: boolean
  onChange?: (current: UseCountDownCurrent) => void
  onFinish?: () => void
}

export interface UseCountDownCurrent {
  total: number
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export interface UseCountDownReturn {
  current: UseCountDownCurrent
  start: () => void
  pause: () => void
  reset: (totalTime?: number) => void
}

function parseTime(time: number): UseCountDownCurrent {
  const total = Math.max(time, 0)
  const days = Math.floor(total / 1000 / 60 / 60 / 24)
  const hours = Math.floor((total / 1000 / 60 / 60) % 24)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const seconds = Math.floor((total / 1000) % 60)
  const milliseconds = total % 1000
  return { total, days, hours, minutes, seconds, milliseconds }
}

export function useCountDownRuntime(options: UseCountDownOptions): UseCountDownReturn {
  let remaining = Math.max(options.time, 0)
  let rafId: number | null = null
  let lastTime = 0

  const state: UseCountDownCurrent = parseTime(remaining)

  const tick = () => {
    const now = Date.now()
    const delta = now - lastTime
    lastTime = now
    remaining -= delta

    if (remaining <= 0) {
      remaining = 0
      options.onChange?.(parseTime(remaining))
      options.onFinish?.()
      return
    }

    options.onChange?.(parseTime(remaining))
    rafId = requestAnimationFrame(tick)
  }

  return {
    current: state,
    start() {
      if (rafId) return
      lastTime = Date.now()
      rafId = requestAnimationFrame(tick)
    },
    pause() {
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    },
    reset(totalTime = options.time) {
      remaining = Math.max(totalTime, 0)
      options.onChange?.(parseTime(remaining))
    },
  }
}

import { useEffect, useRef, useState } from '@lynx-js/react'

export function useThrottle<T>(value: T, delay: number): T {
  const [throttled, setThrottled] = useState(value)
  const lastUpdate = useRef(Date.now())

  useEffect(() => {
    const now = Date.now()
    const elapsed = now - lastUpdate.current
    if (elapsed >= delay) {
      lastUpdate.current = now
      setThrottled(value)
      return
    }

    const timer = setTimeout(() => {
      lastUpdate.current = Date.now()
      setThrottled(value)
    }, delay - elapsed)

    return () => clearTimeout(timer)
  }, [value, delay])

  return throttled
}
