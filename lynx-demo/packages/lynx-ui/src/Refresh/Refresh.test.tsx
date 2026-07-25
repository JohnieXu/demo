import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { render } from '@lynx-js/react/testing-library'
import type { Element } from '@lynx-js/types/main-thread'

import { Refresh } from './Refresh'
import { NativeRefresh } from './NativeRefresh'
import {
  SimulatedRefresh,
  simulatedRefreshInternals,
} from './SimulatedRefresh'
import { isRefreshSupported } from './platform'

function setPlatform(platform: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).SystemInfo = { platform }
}

describe('Refresh platform detection', () => {
  it('reports native support on Android, Harmony, and Web', () => {
    expect(isRefreshSupported('Android')).toBe(true)
    expect(isRefreshSupported('Harmony')).toBe(true)
    expect(isRefreshSupported('web')).toBe(true)
  })

  it('reports simulated support on iOS, macOS, Windows, pc, and unknown', () => {
    expect(isRefreshSupported('iOS')).toBe(false)
    expect(isRefreshSupported('macOS')).toBe(false)
    expect(isRefreshSupported('windows')).toBe(false)
    expect(isRefreshSupported('pc')).toBe(false)
    expect(isRefreshSupported('unknown')).toBe(false)
  })

  it('reads the current platform from SystemInfo', () => {
    setPlatform('Android')
    expect(isRefreshSupported()).toBe(true)

    setPlatform('iOS')
    expect(isRefreshSupported()).toBe(false)
  })
})

describe('Refresh rendering', () => {
  it('renders the simulated path', () => {
    const { container } = render(
      <SimulatedRefresh refreshing={false} onRefresh={vi.fn()}>
        <view>content</view>
      </SimulatedRefresh>,
    )
    expect(
      container.querySelector('.lu-refresh--simulated'),
    ).toBeInTheDocument()
  })

  it('renders the native path', () => {
    const { container } = render(
      <NativeRefresh refreshing={false} onRefresh={vi.fn()}>
        <view>content</view>
      </NativeRefresh>,
    )
    expect(container.querySelector('.lu-refresh')).toBeInTheDocument()
  })

  it('exposes finishRefresh and startRefresh on ref', () => {
    const ref: { current: import('./types').RefreshRef | null } = {
      current: null,
    }

    render(
      <Refresh ref={ref} refreshing={false}>
        <view>content</view>
      </Refresh>,
    )

    expect(ref.current).not.toBeNull()
    expect(typeof ref.current?.finishRefresh).toBe('function')
    expect(typeof ref.current?.startRefresh).toBe('function')
  })
})

/**
 * Helper: build a Lynx-like main-thread Element mock. Mirrors the minimal
 * surface used by `findScrollable` / `readScrollTopOf`: `tagName`,
 * optionally `querySelector`, and an array-like `children`. The returned
 * value is typed as `Element` so it can be passed directly to the helpers
 * under test — the runtime shape is intentionally narrower than the Lynx
 * `Element` interface because the helpers only read those few fields.
 */
interface MockElOptions {
  scrollTop?: unknown
  children?: unknown[]
  querySelector?: (selector: string) => unknown
}

function makeEl(tag: string, opts: MockElOptions = {}): Element {
  const el = {
    tagName: tag.toUpperCase(),
    scrollTop: opts.scrollTop,
    children: opts.children,
    querySelector: opts.querySelector,
  } as unknown as Element
  if ('scrollTop' in opts) {
    Object.assign(el, { scrollTop: opts.scrollTop })
  }
  if (Array.isArray(opts.children)) {
    ;(el as unknown as { children: unknown[] }).children = opts.children
  }
  if (typeof opts.querySelector === 'function') {
    ;(el as unknown as {
      querySelector: (s: string) => unknown
    }).querySelector = opts.querySelector
  }
  return el
}

describe('SimulatedRefresh nested scrollable resolution', () => {
  it('returns the element itself when it is already a list', () => {
    const list = makeEl('list', { scrollTop: 42 })
    expect(simulatedRefreshInternals.findScrollable(list)).toBe(list)
    expect(simulatedRefreshInternals.readScrollTopOf(list)).toBe(42)
  })

  it('returns the element itself when it is already a scroll-view', () => {
    const sv = makeEl('scroll-view', { scrollTop: 0 })
    expect(simulatedRefreshInternals.findScrollable(sv)).toBe(sv)
  })

  it('finds a directly-nested scrollable via querySelector when present', () => {
    const inner = makeEl('list', { scrollTop: 7 })
    const wrapper = makeEl('view', {
      querySelector: (sel: string) =>
        sel.includes('list') ? inner : null,
    })
    expect(simulatedRefreshInternals.findScrollable(wrapper)).toBe(inner)
  })

  it('falls back to a recursive children walk when querySelector is missing', () => {
    const inner = makeEl('scroll-view', { scrollTop: 0 })
    const wrapper = makeEl('view', {
      children: [
        makeEl('view', { children: [makeEl('view', { children: [inner] })] }),
        makeEl('view'),
      ],
    })
    expect(simulatedRefreshInternals.findScrollable(wrapper)).toBe(inner)
  })

  it('returns null when no scrollable descendant exists', () => {
    const wrapper = makeEl('view', {
      children: [makeEl('view'), makeEl('text')],
    })
    expect(simulatedRefreshInternals.findScrollable(wrapper)).toBeNull()
  })

  it('caches the first resolved scrollable and invalidates it on a stale tag', () => {
    const inner = makeEl('list', { scrollTop: 0 })
    const wrapper = makeEl('view', {
      querySelector: (sel: string) => (sel.includes('list') ? inner : null),
    })
    const cache = { current: null }
    expect(simulatedRefreshInternals.findScrollable(wrapper, cache)).toBe(inner)
    expect(cache.current).toBe(inner)

    // A cached element that no longer has a scrollable tag should be cleared.
    const staleCache = { current: makeEl('view') }
    expect(simulatedRefreshInternals.findScrollable(wrapper, staleCache)).toBe(inner)
    expect(staleCache.current).toBe(inner)
  })
})

describe('SimulatedRefresh readScrollTopOf', () => {
  it('returns 0 for null/undefined values', () => {
    expect(
      simulatedRefreshInternals.readScrollTopOf(makeEl('list', { scrollTop: null })),
    ).toBe(0)
    expect(
      simulatedRefreshInternals.readScrollTopOf(makeEl('list', { scrollTop: undefined })),
    ).toBe(0)
  })

  it('coerces numeric strings to numbers', () => {
    expect(
      simulatedRefreshInternals.readScrollTopOf(makeEl('list', { scrollTop: '123' })),
    ).toBe(123)
  })

  it('falls back to 0 for non-finite values', () => {
    expect(
      simulatedRefreshInternals.readScrollTopOf(makeEl('list', { scrollTop: 'abc' })),
    ).toBe(0)
  })
})
