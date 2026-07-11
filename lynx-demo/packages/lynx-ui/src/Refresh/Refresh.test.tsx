import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { Refresh } from './Refresh'
import { NativeRefresh } from './NativeRefresh'
import { SimulatedRefresh } from './SimulatedRefresh'
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
