import { create } from 'zustand'
import { setAuthToken } from 'travel-data'
import type { Loginv1Result, MemberBasicInfo } from 'travel-domain'

export type AuthState = {
  /** Session token issued by the server (null = logged out). */
  token: string | null
  memberId: string | null
  /** Display name from login / get-basic. */
  userName: string | null
  /** Full member profile (from login response + get-basic). */
  profile: MemberBasicInfo | null

  isAuthenticated: boolean

  /** Called after a successful login. Syncs token into travel-data's request interceptor. */
  setAuth: (result: Loginv1Result) => void
  /** Merge get-basic profile into the store. */
  setProfile: (profile: MemberBasicInfo) => void
  /** Clear session (logout / 401). Also clears token from travel-data. */
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  'background only';
  return {
    token: null,
    memberId: null,
    userName: null,
    profile: null,
    isAuthenticated: false,

    setAuth: (result) => {
      'background only';
      const token = result.loginToken ?? null
      // Internal detail: travel-data's interceptor reads this module-level token
      // to inject the Authorization header. Consumers only see this store.
      setAuthToken(token)
      set({
        token,
        memberId: result.memberId ?? null,
        userName: result.memberBasicInfo?.userName ?? result.name ?? null,
        profile: result.memberBasicInfo ?? null,
        isAuthenticated: !!token,
      })
    },

    setProfile: (profile) => {
      'background only';
      return set((state) => ({
        profile,
        userName: profile.userName ?? state.userName,
        }))
    },

    clearAuth: () => {
      'background only';
      setAuthToken(null)
      set({
        token: null,
        memberId: null,
        userName: null,
        profile: null,
        isAuthenticated: false,
      })
    },
  }
})
