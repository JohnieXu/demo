// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { useMemo } from '@lynx-js/react'
import type { IconProps, IconSource, ResolvedIcon } from './types'
import type { IconVariant } from './platform'
import { isVariantSupported } from './platform'

/**
 * Compute the final { variant, src } for an Icon given its props and
 * the current platform's feature support.
 *
 * Resolution order:
 * 1. `props.force` — bypasses platform detection.
 * 2. `svg` if the platform supports it.
 * 3. `png` if the platform supports `image`.
 * 4. `placeholder` if the platform supports `placeholder`.
 * 5. Empty placeholder (`variant='placeholder'`, `src=null`).
 */
export function useResolvedIcon(props: IconProps): ResolvedIcon {
  const { svg, png, placeholder, force } = props
  return useMemo<ResolvedIcon>(
    () => resolveIcon(svg, png, placeholder, force),
    [svg, png, placeholder, force],
  )
}

/**
 * Pure version of `useResolvedIcon` for unit testing and SSR.
 */
export function resolveIcon(
  svg: IconSource,
  png?: IconSource,
  placeholder?: IconSource,
  force?: IconVariant,
): ResolvedIcon {
  if (force) {
    return pick(force, svg, png, placeholder)
  }
  if (isVariantSupported('svg')) {
    return { variant: 'svg', src: svg }
  }
  if (png && isVariantSupported('image')) {
    return { variant: 'image', src: png }
  }
  if (placeholder && isVariantSupported('placeholder')) {
    return { variant: 'placeholder', src: placeholder }
  }
  return { variant: 'placeholder', src: null }
}

function pick(
  variant: IconVariant,
  svg: IconSource,
  png: IconSource | undefined,
  placeholder: IconSource | undefined,
): ResolvedIcon {
  let src: IconSource | null
  if (variant === 'svg') {
    src = svg
  } else if (variant === 'image') {
    src = png ?? null
  } else {
    src = placeholder ?? null
  }
  return { variant, src: src ?? null }
}
