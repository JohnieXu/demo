// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License, Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

/**
 * Shared platform detection for the lynx-ui package.
 *
 * This module is the single source of truth for "which runtime platform are we
 * running on". Component-specific feature matrices live next to their
 * components (e.g. `Icon/platform.ts`, `Refresh/platform.ts`) and consume
 * `getCurrentPlatform()` from here.
 */

/**
 * Union of platforms lynx-ui can distinguish.
 *
 * Mirrors `SystemInfo.platform` from the Lynx runtime where available, and
 * adds `web` and `unknown` for lynx-web, Storybook, SSR, and test runners.
 */
export type LynxPlatform =
  | 'iOS'
  | 'Android'
  | 'Harmony'
  | 'macOS'
  | 'windows'
  | 'pc'
  | 'web'
  | 'unknown'

const KNOWN_PLATFORMS: readonly string[] = [
  'iOS',
  'Android',
  'Harmony',
  'macOS',
  'windows',
  'pc',
  'web',
  'unknown',
]

/**
 * Resolve the current platform.
 *
 * Detection order:
 * 1. `SystemInfo.platform` from the Lynx runtime (preferred).
 * 2. Browser globals — fall back to `web` for lynx-web / dev preview.
 * 3. `unknown` for everything else (test runners, SSR, ...).
 */
export function getCurrentPlatform(): LynxPlatform {
  try {
    // `SystemInfo` is declared as a global by @lynx-js/types.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const info = (globalThis as any).SystemInfo
    if (info && typeof info.platform === 'string') {
      const platform = info.platform as LynxPlatform
      if (KNOWN_PLATFORMS.includes(platform)) {
        return platform
      }
    }
  } catch {
    // SystemInfo access can throw in some test environments; ignore.
  }

  // Browser environment without SystemInfo (lynx-web / dev preview).
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return 'web'
  }

  return 'unknown'
}
