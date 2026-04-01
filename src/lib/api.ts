import axios from 'axios'
import { useAuthStore } from '@/store/useAuthStore'

const API_BASE_URL = (() => {
  const url = process.env.NEXT_PUBLIC_API_URL
  if (url) return url
  if (process.env.NODE_ENV === 'development') return 'http://localhost:8080'
  throw new Error('NEXT_PUBLIC_API_URL 환경 변수가 설정되지 않았습니다.')
})()

export function getErrorMessage(error: unknown, fallback = '알 수 없는 오류가 발생했습니다.'): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) return error.response.data.message
    if (error.code === 'ECONNABORTED') return '서버 응답 시간이 초과되었습니다.'
    if (!error.response) return '네트워크 연결을 확인해주세요.'
  }
  if (error instanceof Error) return error.message
  return fallback
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// 요청 인터셉터 — 토큰 자동 첨부 + FormData Content-Type 처리
api.interceptors.request.use((config) => {
  // FormData 전송 시 Content-Type 제거 (브라우저가 multipart/form-data + boundary 자동 설정)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  const url = config.url || ''

  if (url.startsWith('/api/auth/') && !url.includes('/change-password')) {
    return config
  }

  let { accessToken, affiliationId } = useAuthStore.getState()

  if ((!accessToken || !affiliationId) && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('auth-storage')
      if (stored) {
        const parsed = JSON.parse(stored)
        accessToken = accessToken || parsed.state?.accessToken
        affiliationId = affiliationId || parsed.state?.affiliationId
      }
    } catch (e) {
      console.warn('[api] localStorage 인증 정보 읽기 실패:', e)
      try { localStorage.removeItem('auth-storage') } catch (removeErr) {
        console.warn('[api] localStorage auth-storage 삭제 실패:', removeErr)
      }
    }
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  if (affiliationId) {
    config.headers['affiliationId'] = affiliationId
  }
  // TODO: 서버 programs.path와 매핑하는 로직으로 교체 필요
  // config.headers['currentPath'] = '/store/info'
  return config
})

// 토큰 갱신 상태 관리
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token)
    } else {
      reject(error)
    }
  })
  failedQueue = []
}

function forceLogout() {
  useAuthStore.getState().clearAuth()
  if (typeof window !== 'undefined') {
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = '/login?reason=session_expired'
    }
  }
}

// 응답 인터셉터 — 401 시 토큰 자동 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    const url = originalRequest.url || ''
    if (url.startsWith('/api/auth/') && !url.includes('/change-password')) {
      forceLogout()
      return Promise.reject(error)
    }

    let refreshToken = useAuthStore.getState().refreshToken

    if (!refreshToken && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('auth-storage')
        if (stored) {
          const parsed = JSON.parse(stored)
          refreshToken = parsed.state?.refreshToken ?? null
        }
      } catch (err) {
        console.warn('[api] 리프레시 토큰 localStorage 읽기 실패:', err)
      }
    }

    if (!refreshToken) {
      forceLogout()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            originalRequest._retry = true
            resolve(api(originalRequest))
          },
          reject,
        })
      })
    }

    isRefreshing = true
    originalRequest._retry = true

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      )

      const newAccessToken = response.data?.data?.accessToken
      if (!newAccessToken) {
        throw new Error('토큰 갱신 응답에 accessToken이 없습니다.')
      }

      useAuthStore.getState().setAccessToken(newAccessToken)

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      processQueue(null, newAccessToken)

      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      forceLogout()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
