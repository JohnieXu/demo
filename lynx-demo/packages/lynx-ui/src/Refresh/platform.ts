// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License, Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

/**
 * Platform capability matrix for the Refresh component.
 *
 * Native `<refresh>` is used on platforms that ship it. Every other platform
 * falls back to the simulated pull-to-refresh implementation.
 */

import { getCurrentPlatform, type LynxPlatform } from '../platform'

export type RefreshPlatform = LynxPlatform

const FEATURE_MATRIX: Record<RefreshPlatform, { refresh: boolean }> = {
  // Native <refresh> is available on Android, Harmony, and Web (Lynx 3.8+).
  Android: { refresh: true },
  Harmony: { refresh: true },
  web: { refresh: true },

  // iOS currently lacks <refresh> in the LynxExplorer used by this project,
  // and desktop platforms do not support it at all.
  iOS: { refresh: false },
  macOS: { refresh: false },
  windows: { refresh: false },
  pc: { refresh: false },
  unknown: { refresh: false },
}

/**
 * Returns whether the current (or given) platform supports the native
 * `<refresh>` element.
 */
export function isRefreshSupported(
  platform: RefreshPlatform = getCurrentPlatform(),
): boolean {
  return FEATURE_MATRIX[platform]?.refresh ?? false
}

/**
 * Exposed for testing only. Treat the return value as read-only.
 */
export function getFeatureMatrixForTesting(): Readonly<typeof FEATURE_MATRIX> {
  return FEATURE_MATRIX
}
