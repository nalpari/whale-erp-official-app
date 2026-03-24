"use client"

import { useRef } from "react"
import { redirect, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"

function hasStoredToken(): boolean {
  if (typeof window === "undefined") return false
  try {
    const stored = localStorage.getItem("auth-storage")
    if (stored) {
      return !!JSON.parse(stored).state?.accessToken
    }
  } catch {
    // ignore
  }
  return false
}

export default function SubLayout({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const pathname = usePathname()
  const checkedRef = useRef<boolean | null>(null)

  if (checkedRef.current == null) {
    checkedRef.current = true
    const tokenExists = !!accessToken || hasStoredToken()
    if (!tokenExists) {
      redirect(`/login?returnUrl=${encodeURIComponent(pathname)}`)
    }
  }

  return <>{children}</>
}
