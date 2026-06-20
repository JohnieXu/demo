// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { CSSProperties } from '@lynx-js/types'
import type { IconVariant } from './platform'

/**
 * A source can be any of:
 * - a URL string (e.g. `/assets/icon.svg`, `https://cdn/icon.svg`)
 * - a raw SVG XML string
 * - a `data:` URL
 * - an opaque string as produced by the build's `*.svg` import
 */
export type IconSource = string

export interface IconProps {
  /**
   * SVG source. Required.
   *
   * On platforms where `<svg>` is supported (iOS / Android / Harmony),
   * this is rendered as the native `<svg>` element. On other platforms,
   * `png` is used as the bitmap fallback when provided.
   */
  svg: IconSource

  /**
   * PNG fallback source for platforms that don't render `<svg>`
   * (e.g. macOS, web).
   *
   * Strongly recommended when shipping icons to non-mobile platforms.
   */
  png?: IconSource

  /**
   * Last-resort source used when neither `svg` nor `png` is available
   * for the current platform. Typically a tiny gray png or a base64
   * 1×1 placeholder. Renders as a normal `<image>`.
   */
  placeholder?: IconSource

  /**
   * Render size. Accepts a number (interpreted as px) or any CSS length
   * string (e.g. `'1em'`, `'24px'`). When omitted, sizing is left to
   * the caller's `style` / `className` to keep the component headless.
   */
  size?: number | string

  /**
   * Extra class names appended to the built-in `lynx-ui-icon` /
   * `lynx-ui-icon--<variant>` classes. Use this to attach project
   * styles (e.g. `className="bottom-tab-icon bottom-icon-booking"`).
   */
  className?: string

  /**
   * Inline style applied to the underlying element. `size` is merged
   * in (overrides any width/height in this object).
   */
  style?: CSSProperties

  /**
   * Force a specific variant. Bypasses platform detection.
   *
   * Use this for tests, storybook previews, or one-off per-platform
   * overrides. Production code should usually leave it unset.
   */
  force?: IconVariant

  /**
   * Extra props spread onto the native `<svg>` element. Useful for
   * `main-thread:bindtap` and other platform-specific attributes.
   * Ignored when the resolved variant is not `svg`.
   */
  svgProps?: Record<string, unknown>

  /**
   * Extra props spread onto the native `<image>` element.
   * Ignored when the resolved variant is `svg`.
   */
  imageProps?: Record<string, unknown>
}

/**
 * Internal: the result of running `useIconSource`.
 */
export interface ResolvedIcon {
  /**
   * The variant the Icon should render.
   * - `placeholder` with `src === null` means "render an empty box".
   */
  variant: IconVariant
  /**
   * The source URL to feed into the underlying element, or `null`
   * when nothing is available and the placeholder box should be empty.
   */
  src: IconSource | null
}
