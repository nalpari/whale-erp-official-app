import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import type { LoginRequest, LoginResponse, AuthoritySelectResponse } from '@/types/auth'

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await api.post<{ data: LoginResponse }>('/api/auth/login', data)
      return response.data.data
    },
  })
}

export function useAuthoritySelectMutation() {
  return useMutation({
    mutationFn: async ({ authorityId, accessToken }: { authorityId: number; accessToken: string }) => {
      const response = await api.post<{ data: AuthoritySelectResponse }>(
        '/api/auth/authority',
        { authorityId },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      return response.data.data
    },
  })
}
