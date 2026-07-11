// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

/**
 * Platform detection & feature matrix for the lynx-ui Icon component.
 *
 * This is the single source of truth for "which platforms support which
 * rendering variants". When Lynx adds native `<svg>` support to a new
 * platform (e.g. macOS), flip the corresponding bit here ONLY — every
 * call site keeps working.
 */

import { getCurrentPlatform, type LynxPlatform } from '../platform'

/**
 * Re-export the shared platform type so Icon consumers do not need to import
 * from two places. Icon-specific behavior is driven by the feature matrix
 * below, not by the platform name itself.
 */
export type IconPlatform = LynxPlatform

/**
 * The rendering variants the Icon component can produce.
 *
 * - `svg`: native `<svg>` element (xelement on iOS/Android/Harmony)
 * - `image`: native `<image>` element (bitmap / png)
 * - `placeholder`: empty `<view>` with the same box size, used as a
 *   last-resort fallback so layout stays intact
 */
export type IconVariant = 'svg' | 'image' | 'placeholder'

/**
 * Feature support matrix.
 *
 * To enable a new platform's SVG support in the future, flip `svg` to
 * `true` for that platform. No call site or component logic needs to
 * change.
 */
const FEATURE_MATRIX: Record<IconPlatform, Record<IconVariant, boolean>> = {
  iOS: { svg: false, image: true, placeholder: true },
  Android: { svg: true, image: true, placeholder: true },
  Harmony: { svg: true, image: true, placeholder: true },
  macOS: { svg: false, image: true, placeholder: true },
  windows: { svg: false, image: true, placeholder: true },
  pc: { svg: false, image: true, placeholder: true },
  web: { svg: false, image: true, placeholder: true },
  unknown: { svg: false, image: true, placeholder: true },
}

/**
 * Returns whether a given variant is supported on the given platform
 * (defaults to the current platform).
 */
export function isVariantSupported(
  variant: IconVariant,
  platform: IconPlatform = getCurrentPlatform(),
): boolean {
  return FEATURE_MATRIX[platform]?.[variant] ?? false
}

/**
 * Exposed for testing only. Treat the return value as read-only.
 */
export function getFeatureMatrixForTesting(): Readonly<typeof FEATURE_MATRIX> {
  return FEATURE_MATRIX
}
