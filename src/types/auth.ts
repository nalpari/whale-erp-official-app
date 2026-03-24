import type { LoginAuthorityProgram } from '@/store/useAuthStore'

export interface LoginRequest {
  loginId: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  authority?: {
    authorityId: number
    programs: LoginAuthorityProgram[]
    ownerCode?: string
  }
  companies?: Array<{
    authorityId: number
    companyName: string | null
    brandName: string | null
    ownerCode?: string
  }>
  loginId?: string
  name?: string
  mobilePhone?: string
  avatar?: string | null
  subscriptionPlanId?: number
  passwordChangeRequired?: boolean
}

export interface AuthoritySelectResponse {
  authority?: {
    programs: LoginAuthorityProgram[]
    ownerCode?: string
  }
}
