// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { CSSProperties } from '@lynx-js/types'
import { useResolvedIcon } from './useIconSource'
import type { IconProps } from './types'

/**
 * Cross-platform Icon component for the lynx-ui package.
 *
 * - On `<svg>`-capable platforms (iOS / Android / Harmony) it renders
 *   the native `<svg>` element with the supplied `svg` source.
 * - On other platforms (macOS / web / ...) it falls back to `<image>`
 *   with the `png` source, or to an empty `<view>` placeholder when
 *   nothing usable is provided.
 *
 * Sizing is intentionally left to the caller (via `className` /
 * `style` / the `size` prop) so the component stays headless and
 * matches the rest of the lynx-ui package.
 *
 * @example
 *   <Icon svg={bookingSvg} png={bookingPng} className="icon" />
 *   <Icon svg={bookingSvg} size={24} />
 */
export function Icon(props: IconProps) {
  const {
    size,
    className,
    style,
    svgProps,
    imageProps,
  } = props
  const { variant, src } = useResolvedIcon(props)

  if (variant === 'placeholder' && src == null) {
    // Render an empty box so layout stays intact; warn once for
    // mis-configured call sites.
    warnMissingSource()
  }

  const mergedClassName = joinClass('lynx-ui-icon', `lynx-ui-icon--${variant}`, className)
  const mergedStyle = mergeSizeStyle(size, style)

  if (variant === 'svg' && src != null) {
    return (
      <svg
        className={mergedClassName}
        src={src}
        style={mergedStyle}
        {...svgProps}
      />
    )
  }
  if (src != null) {
    // Covers both 'image' and 'placeholder with src'.
    return (
      <image
        className={mergedClassName}
        src={src}
        style={mergedStyle}
        {...imageProps}
      />
    )
  }
  return (
    <view
      className={mergedClassName}
      style={mergedStyle}
    />
  )
}

function joinClass(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

function mergeSizeStyle(
  size: number | string | undefined,
  style?: CSSProperties,
): CSSProperties | undefined {
  if (size == null) {
    return style
  }
  if (isNumber(size)) {
    return { ...(style ?? {}), width: size + 'px', height: size + 'px' }
  }
  return { ...(style ?? {}), width: size, height: size }
}

// Throttled warning: at most once per module-load.
let didWarnMissing = false
function warnMissingSource() {
  if (didWarnMissing) return
  if (typeof console !== 'undefined') {
    console.warn(
      '[lynx-ui][Icon] No usable source for the current platform. '
        + 'Provide `svg` and (optionally) `png` / `placeholder`.',
    )
  }
  didWarnMissing = true
}
