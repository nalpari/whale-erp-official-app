'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import OverTimeStub from '@/components/overtime/OverTimeStub'
import type { OvertimeAllowanceDetail } from '@/types/overtime'

const PREVIEW_KEY = 'overtimeStubPreview'

export default function OverTimeNewStubPage() {
  const router = useRouter()
  const [previewData] = useState<OvertimeAllowanceDetail | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = sessionStorage.getItem(PREVIEW_KEY)
      if (!raw) return null
      sessionStorage.removeItem(PREVIEW_KEY)
      return JSON.parse(raw) as OvertimeAllowanceDetail
    } catch (err) {
      console.warn('[OverTimeNewStubPage] sessionStorage 파싱 실패:', err)
      sessionStorage.removeItem(PREVIEW_KEY)
      return null
    }
  })

  useEffect(() => {
    if (!previewData) {
      router.replace('/overtime/new')
    }
  }, [previewData, router])

  if (!previewData) return null

  return <OverTimeStub initialData={previewData} isPreview />
}
