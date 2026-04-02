'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import OverTimeWorkEdit from '@/components/overtime/OverTimeWorkEdit'
import type { OvertimeAllowanceDetail, OvertimeAllowanceItemDto } from '@/types/overtime'

const PREVIEW_KEY = 'overtimeStubPreview'
const DRAFT_KEY = 'overtimeFormDraft'

const safeJsonParse = <T,>(raw: string): T | null => {
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export default function OverTimeNewTimePage() {
  const router = useRouter()

  const [draftContractWage] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return 0
    const draft = safeJsonParse<{ contractWage?: number }>(raw)
    return draft?.contractWage ?? 0
  })

  const [previewData] = useState<OvertimeAllowanceDetail | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = sessionStorage.getItem(PREVIEW_KEY)
      if (!raw) return null
      return JSON.parse(raw) as OvertimeAllowanceDetail
    } catch (err) {
      console.warn('[OverTimeNewTimePage] sessionStorage 파싱 실패:', err)
      sessionStorage.removeItem(PREVIEW_KEY)
      return null
    }
  })

  useEffect(() => {
    if (!previewData) {
      router.replace('/overtime/new')
    }
  }, [previewData, router])

  const handlePreviewSave = useCallback((items: OvertimeAllowanceItemDto[]) => {
    // stubPreview 업데이트
    const raw = sessionStorage.getItem(PREVIEW_KEY)
    if (raw) {
      const data = safeJsonParse<OvertimeAllowanceDetail>(raw)
      if (data) {
        data.details = items
        const totalPayment = items.reduce((sum, i) => sum + (i.actualPaymentAmount || 0), 0)
        const totalDeduction = items.reduce((sum, i) => sum + (i.deductionAmount || 0), 0)
        data.grossOvertimeAmount = totalPayment
        data.totalDeductionAmount = totalDeduction
        data.actualOvertimeAmount = totalPayment - totalDeduction
        data.totalAmount = totalPayment - totalDeduction
        data.totalWorkDays = items.length
        data.totalOvertimeHours = items.reduce((sum, i) => sum + (i.actualOvertimeHours || 0), 0)
        sessionStorage.setItem(PREVIEW_KEY, JSON.stringify(data))
      }
    }

    // formDraft 업데이트
    const draftRaw = sessionStorage.getItem(DRAFT_KEY)
    if (draftRaw) {
      const draft = safeJsonParse<{ details?: OvertimeAllowanceItemDto[] }>(draftRaw)
      if (draft) {
        draft.details = items
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
      }
    }
  }, [])

  if (!previewData) return null

  return (
    <OverTimeWorkEdit
      initialData={previewData}
      isPreview
      onPreviewSave={handlePreviewSave}
      contractWage={draftContractWage}
    />
  )
}
