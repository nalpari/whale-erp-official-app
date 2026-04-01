'use client'
import { useState } from 'react'
import { redirect } from 'next/navigation'
import PartTimerPayStub from '@/components/parttimer/PartTimerPayStub'
import type { PartTimerPayrollDetail } from '@/types/parttime-payroll'

const PREVIEW_KEY = 'partTimerStubPreview'

export default function PartTimerNewStubPage() {
  const [previewData] = useState<PartTimerPayrollDetail | null>(() => {
    if (typeof window === 'undefined') return null
    const raw = sessionStorage.getItem(PREVIEW_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PartTimerPayrollDetail
  })

  if (!previewData) {
    redirect('/parttimer/new')
  }

  return <PartTimerPayStub initialData={previewData} isPreview />
}
