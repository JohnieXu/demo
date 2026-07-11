// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License, Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { forwardRef } from '@lynx-js/react'
import { NativeRefresh } from './NativeRefresh'
import { SimulatedRefresh } from './SimulatedRefresh'
import { isRefreshSupported } from './platform'
import type { RefreshProps, RefreshRef } from './types'

/**
 * Cross-platform pull-to-refresh wrapper.
 *
 * - On platforms that support the native `<refresh>` element
 *   (Android, Harmony, Web) it delegates to the runtime implementation.
 * - On all other platforms it uses a main-thread gesture simulation that
 *   exposes the same props and imperative API.
 */
export const Refresh = forwardRef<RefreshRef, RefreshProps>(
  function Refresh(props, ref) {
    const supported = isRefreshSupported()
    if (supported) {
      return <NativeRefresh ref={ref} {...props} />
    }
    return <SimulatedRefresh ref={ref} {...props} />
  },
)
