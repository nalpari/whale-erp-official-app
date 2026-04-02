'use client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import OverTimeWorkEdit from '@/components/overtime/OverTimeWorkEdit'
import { safeSessionGet, safeSessionSet } from '@/lib/overtime-utils'
import type { OvertimeAllowanceDetail, OvertimeAllowanceItemDto } from '@/types/overtime'

const PREVIEW_KEY = 'overtimeStubPreview'
const DRAFT_KEY = 'overtimeFormDraft'

export default function OverTimeNewTimePage() {
  const router = useRouter()

  const [draftContractWage] = useState<number>(() => {
    const draft = safeSessionGet<{ contractWage?: number }>(DRAFT_KEY)
    return draft?.contractWage ?? 0
  })

  const [previewData] = useState<OvertimeAllowanceDetail | null>(() => {
    return safeSessionGet<OvertimeAllowanceDetail>(PREVIEW_KEY)
  })

  useEffect(() => {
    if (!previewData) {
      router.replace('/overtime/new')
    }
  }, [previewData, router])

  const handlePreviewSave = useCallback((items: OvertimeAllowanceItemDto[]) => {
    // stubPreview 업데이트
    const data = safeSessionGet<OvertimeAllowanceDetail>(PREVIEW_KEY)
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
      safeSessionSet(PREVIEW_KEY, data)
    }

    // formDraft 업데이트
    const draft = safeSessionGet<{ details?: OvertimeAllowanceItemDto[] }>(DRAFT_KEY)
    if (draft) {
      draft.details = items
      safeSessionSet(DRAFT_KEY, draft)
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
