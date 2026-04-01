'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PartTimerPayStub from '@/components/parttimer/PartTimerPayStub'
import type { PartTimerPayrollDetail } from '@/types/parttime-payroll'

const PREVIEW_KEY = 'partTimerStubPreview'

export default function PartTimerNewStubPage() {
  const router = useRouter()
  const [previewData] = useState<PartTimerPayrollDetail | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = sessionStorage.getItem(PREVIEW_KEY)
      if (!raw) return null
      sessionStorage.removeItem(PREVIEW_KEY)
      return JSON.parse(raw) as PartTimerPayrollDetail
    } catch {
      sessionStorage.removeItem(PREVIEW_KEY)
      return null
    }
  })

  useEffect(() => {
    if (!previewData) {
      router.replace('/parttimer/new')
    }
  }, [previewData, router])

  if (!previewData) return null

  return <PartTimerPayStub initialData={previewData} isPreview />
}
