"use client"

import { useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"

function hasStoredToken(): boolean {
  if (typeof window === "undefined") return false
  try {
    const stored = localStorage.getItem("auth-storage")
    if (stored) {
      return !!JSON.parse(stored).state?.accessToken
    }
  } catch (e) {
    console.warn("[AuthGuard] localStorage 인증 정보 읽기 실패:", e)
    try { localStorage.removeItem("auth-storage") } catch { /* noop */ }
  }
  return false
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const accessToken = useAuthStore((s) => s.accessToken)
  const redirectedRef = useRef<boolean | null>(null)

  const tokenExists = !!accessToken || hasStoredToken()

  useEffect(() => {
    if (!tokenExists && redirectedRef.current == null) {
      redirectedRef.current = true
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`)
    }
  }, [tokenExists, router, pathname])

  if (!tokenExists) {
    return null
  }

  return <>{children}</>
}
