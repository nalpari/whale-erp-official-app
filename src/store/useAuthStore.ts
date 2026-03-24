import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LoginAuthorityProgram {
  id: number
  name: string
  path: string
  level: number
  canRead: boolean | null
  canCreateDelete: boolean | null
  canUpdate: boolean | null
  children: LoginAuthorityProgram[] | null
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  authority: LoginAuthorityProgram[] | null
  affiliationId: string | null
  ownerCode: string | null
  loginId: string | null
  name: string | null
  mobilePhone: string | null
  avatar: string | null
  passwordChangeRequired: boolean
}

interface AuthStore extends AuthState {
  setTokens: (accessToken: string, refreshToken: string) => void
  setAccessToken: (token: string | null) => void
  setAuthority: (authority: LoginAuthorityProgram[]) => void
  setAffiliationId: (id: string | null) => void
  setOwnerCode: (code: string | null) => void
  setUserInfo: (loginId: string, name: string, mobilePhone: string, avatar: string | null) => void
  setPasswordChangeRequired: (required: boolean) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      authority: null,
      affiliationId: null,
      ownerCode: null,
      loginId: null,
      name: null,
      mobilePhone: null,
      avatar: null,
      passwordChangeRequired: false,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      setAccessToken: (token) => set({ accessToken: token }),
      setAuthority: (authority) => set({ authority }),
      setAffiliationId: (id) => set({ affiliationId: id }),
      setOwnerCode: (code) => set({ ownerCode: code }),
      setUserInfo: (loginId, name, mobilePhone, avatar) =>
        set({ loginId, name, mobilePhone, avatar }),
      setPasswordChangeRequired: (required) => set({ passwordChangeRequired: required }),
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          authority: null,
          affiliationId: null,
          ownerCode: null,
          loginId: null,
          name: null,
          mobilePhone: null,
          avatar: null,
          passwordChangeRequired: false,
        }),
    }),
    { name: 'auth-storage' }
  )
)
