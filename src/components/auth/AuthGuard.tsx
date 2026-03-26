"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { useMounted } from "@/hooks/use-mounted"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const accessToken = useAuthStore((s) => s.accessToken)
  const mounted = useMounted()

  // 클라이언트에서만 localStorage 확인
  const hasToken = (() => {
    if (!mounted) return false
    if (accessToken) return true
    try {
      const stored = localStorage.getItem("auth-storage")
      if (stored) return !!JSON.parse(stored).state?.accessToken
    } catch {
      /* noop */
    }
    return false
  })()

  useEffect(() => {
    if (mounted && !hasToken) {
      const search = window.location.search
      const fullPath = pathname + search
      router.replace(`/login?returnUrl=${encodeURIComponent(fullPath)}`)
    }
  }, [mounted, hasToken, router, pathname])

  // 서버 & 마운트 전: children을 그대로 렌더링 (hydration 일치)
  // 마운트 후 토큰 없으면: 리다이렉트 중이므로 빈 화면
  if (mounted && !hasToken) {
    return null
  }

  return <>{children}</>
}
