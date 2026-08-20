import type { NavigateFunction } from 'react-router'

/**
 * How the auth (login) flow is launched when a protected action needs a
 * session. Abstracted as a strategy so the host can switch between
 * "same ReactLynx instance, in-app router jump" and "travel-auth shipped as
 * an independent Lynx bundle, cross-bundle openSchema" without touching
 * business call sites (Booking page, etc.).
 */

export interface AuthLaunchContext {
  /** The route the user was on when auth was required (used for redirect-back). */
  from: string
}

export interface AuthLaunchStrategy {
  readonly mode: 'in-app' | 'cross-bundle'
  launchAuth(ctx: AuthLaunchContext): void
}

/**
 * Default: travel-auth is mounted inside the host app (flight) as routes, so
 * launching auth is a plain react-router navigation within the same
 * ReactLynx instance.
 *
 * Stateless: `navigate` is injected by the caller (the useRequireAuth hook),
 * not stored on the strategy.
 */
export class InAppRouteStrategy implements AuthLaunchStrategy {
  readonly mode = 'in-app' as const

  /** navigate is bound lazily via withNavigate(); see useRequireAuth. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  launchAuth(_ctx: AuthLaunchContext): void {
    // Bound at runtime by withNavigate(); this base implementation is a
    // fallback that should never run because useRequireAuth always binds.
    throw new Error(
      'InAppRouteStrategy.launchAuth called without a bound navigate. ' +
        'Use InAppRouteStrategy.withNavigate() from useRequireAuth.',
    )
  }

  /** Returns a launch function closed over react-router's navigate. */
  withNavigate(navigate: NavigateFunction): (ctx: AuthLaunchContext) => void {
    return (ctx) => {
      navigate('/login', { state: { from: ctx.from } })
    }
  }
}

/**
 * Future: travel-auth is shipped as a standalone ReactLynx bundle. Launching
 * auth means asking the host to open that bundle in a new native container
 * via `NativeModules.ExplorerModule.openSchema`, passing `from` as a query
 * param (readable in the target bundle via `lynx.__globalProps`).
 *
 * NOT ACTIVE in this iteration — the host URL convention and the
 * redirect-back mechanism are not finalized yet. Provided so the strategy
 * surface already supports cross-bundle mode; wire it up with
 * `setAuthLaunchStrategy(new CrossBundleStrategy(authBundleUrl))` when ready.
 *
 * NOTE: in cross-bundle mode the flight bundle can NOT read travel-auth's
 * authStore (separate JS context). The "is authenticated" check in
 * useRequireAuth will then need a host-shared store (e.g. a native local
 * storage module) instead of the in-memory zustand store. That state-read
 * abstraction is deliberately out of scope until the global persistence
 * solution is decided.
 */
export class CrossBundleStrategy implements AuthLaunchStrategy {
  readonly mode = 'cross-bundle' as const

  constructor(private readonly authBundleUrl: string) {}

  launchAuth(ctx: AuthLaunchContext): void {
    'background only'
    // TODO(cross-bundle): confirm the host bundle URL convention and the
    // redirect-back scheme (auth bundle re-opens the flight bundle with
    // `from`) before enabling. Until then this throws so it is never used
    // accidentally.
    void ctx
    void this.authBundleUrl
    throw new Error(
      'CrossBundleStrategy is not implemented yet: host bundle URL and ' +
        'redirect-back convention are undecided.',
    )
    // Intended implementation once finalized:
    // const url = `${this.authBundleUrl}?from=${encodeURIComponent(ctx.from)}`
    // NativeModules.ExplorerModule.openSchema(url)
  }
}

let current: AuthLaunchStrategy = new InAppRouteStrategy()

/** Replace the active strategy (e.g. at app startup when switching to cross-bundle). */
export function setAuthLaunchStrategy(strategy: AuthLaunchStrategy): void {
  current = strategy
}

/** The currently active strategy. */
export function getAuthLaunchStrategy(): AuthLaunchStrategy {
  return current
}
