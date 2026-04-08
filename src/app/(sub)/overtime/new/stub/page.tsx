'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useHeaderStore } from '@/store/useHeaderStore'
import OverTimeStub from '@/components/overtime/OverTimeStub'
import { OVERTIME_SESSION_KEYS } from '@/lib/overtime-utils'
import type { OvertimeAllowanceDetail } from '@/types/overtime'

const PREVIEW_KEY = OVERTIME_SESSION_KEYS.PREVIEW

export default function OverTimeNewStubPage() {
  const router = useRouter()
  const [previewData] = useState<OvertimeAllowanceDetail | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = sessionStorage.getItem(PREVIEW_KEY)
      if (!raw) return null
      return JSON.parse(raw) as OvertimeAllowanceDetail
    } catch (err) {
      console.warn('[OverTimeNewStubPage] sessionStorage 파싱 실패:', err)
      sessionStorage.removeItem(PREVIEW_KEY)
      return null
    }
  })

  const setOnBack = useHeaderStore((s) => s.setOnBack)

  useEffect(() => {
    if (!previewData) {
      router.replace('/overtime/new')
      return
    }
    setOnBack(() => router.push('/overtime/new'))
    return () => setOnBack(null)
  }, [previewData, router, setOnBack])

  if (!previewData) return null

  return <OverTimeStub initialData={previewData} isPreview />
}
