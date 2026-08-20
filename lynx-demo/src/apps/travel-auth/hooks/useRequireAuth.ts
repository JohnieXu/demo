import { useLocation, useNavigate } from 'react-router'
import { useCallback } from '@lynx-js/react'
import { useAuthStore } from '../store/authStore'
import { getAuthLaunchStrategy, InAppRouteStrategy } from '../strategies/authLaunchStrategy'

/**
 * Guard for pages/actions that require a logged-in session.
 *
 * Returns a `requireAuth` function: call it before performing a protected
 * action. When authenticated it returns true and the caller continues;
 * otherwise it launches the auth (login) flow via the active
 * AuthLaunchStrategy, carrying the current path as `from` so the login page
 * can navigate back afterwards.
 *
 * The default strategy is InAppRouteStrategy (same-instance router jump).
 * Switch to CrossBundleStrategy at startup when travel-auth ships as a
 * standalone bundle — business call sites stay unchanged.
 */
export function useRequireAuth() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const requireAuth = useCallback((): boolean => {
    if (useAuthStore.getState().isAuthenticated) return true
    const strategy = getAuthLaunchStrategy()
    if (strategy instanceof InAppRouteStrategy) {
      strategy.withNavigate(navigate)({ from: location.pathname })
    } else {
      strategy.launchAuth({ from: location.pathname })
    }
    return false
  }, [navigate, location.pathname])

  return { isAuthenticated, requireAuth }
}
