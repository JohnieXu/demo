/**
 * Public module surface of travel-auth for host apps (e.g. flight).
 *
 * Kept separate from index.tsx on purpose: index.tsx is the standalone
 * build entry (it calls root.render as a side effect) and must never be
 * imported by a host app. Hosts import from this file instead.
 */
export { AuthRoutes } from './routes'
export { useAuthStore } from './store/authStore'
export type { AuthState } from './store/authStore'
export { useRequireAuth } from './hooks/useRequireAuth'
export {
  setAuthLaunchStrategy,
  getAuthLaunchStrategy,
  InAppRouteStrategy,
  CrossBundleStrategy,
} from './strategies/authLaunchStrategy'
export type {
  AuthLaunchStrategy,
  AuthLaunchContext,
} from './strategies/authLaunchStrategy'
