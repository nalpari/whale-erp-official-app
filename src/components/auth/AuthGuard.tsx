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

  // mounted 후 Zustand persist가 rehydrate 완료 — accessToken으로 충분
  const hasToken = mounted && !!accessToken

  useEffect(() => {
    if (mounted && !hasToken) {
      const search = window.location.search
      const fullPath = pathname + search
      router.replace(`/login?returnUrl=${encodeURIComponent(fullPath)}`)
    }
  }, [mounted, hasToken, router, pathname])

  if (mounted && !hasToken) {
    return null
  }

  return <>{children}</>
}
