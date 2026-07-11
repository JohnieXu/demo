// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License, Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

/**
 * Imperative API exposed by the Refresh component.
 *
 * Both the native and simulated implementations implement this interface so
 * callers can finish or start a refresh without caring about the runtime path.
 */
export interface RefreshRef {
  /** End the refresh animation and hide the refresh header. */
  finishRefresh(): void

  /** Programmatically enter the refreshing state and invoke `onRefresh`. */
  startRefresh(): void
}

/**
 * Props for the Refresh component.
 *
 * The API is intentionally narrower than the native `<refresh>` element: it
 * exposes a controlled `refreshing` prop and a plain `onRefresh` callback,
 * removing the need for callers to imperatively call `finishRefresh`.
 */
export interface RefreshProps {
  /** Scrollable content that drives the pull-to-refresh gesture. */
  children: ReactNode

  /** Called when a refresh is triggered by the user or by `startRefresh()`. */
  onRefresh?: () => void

  /**
   * Controlled refresh state.
   *
   * When the value changes from `true` to `false`, the wrapper automatically
   * hides the refresh header. Callers should set this to `true` inside
   * `onRefresh` and back to `false` when the refresh is complete.
   */
  refreshing?: boolean

  /** Custom refresh header. Defaults to a simple text indicator. */
  header?: ReactNode

  /** Height of the refresh header in px. Default: 50. */
  headerHeight?: number

  /** Whether pull-to-refresh is enabled. Maps to `enable-refresh`. Default: true. */
  enabled?: boolean

  /**
   * Pull threshold expressed as a fraction of `headerHeight`.
   * Default: 1.0 (pull equal to the header height triggers refresh).
   */
  threshold?: number

  /** Extra class names applied to the root element. */
  className?: string

  /** Inline styles applied to the root element. */
  style?: CSSProperties
}
