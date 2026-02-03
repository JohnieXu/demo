/**
 * Compatibility shim that maps React Spring's `react` import to `@lynx-js/react`.
 *
 * Why:
 * - `@react-spring/web` expects `react` to export `version` and default export.
 * - Our project uses `@lynx-js/react`, which doesn't provide `version`.
 * - This shim forwards all exports to `@lynx-js/react` and adds a stub `version`.
 *
 * Notes:
 * - `version` here is a stub for compatibility; adjust if needed.
 * - Alias is set in `lynx.config.ts` via `resolve.alias.react`.
 * - If you later use real React, remove the alias and install `react`.
 */
export * from '@lynx-js/react'
import * as ReactLynx from '@lynx-js/react'
export default ReactLynx
export const version = '17.0.2'
