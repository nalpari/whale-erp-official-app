"use client"

import { redirect, usePathname } from "next/navigation"
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
  const accessToken = useAuthStore((s) => s.accessToken)
  const pathname = usePathname()

  const tokenExists = !!accessToken || hasStoredToken()
  if (!tokenExists) {
    redirect(`/login?returnUrl=${encodeURIComponent(pathname)}`)
  }

  return <>{children}</>
}
