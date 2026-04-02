'use client'
import { useCallback, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useOvertimeDetail } from '@/hooks/queries/use-overtime-queries'
import OverTimeWorkEdit from '@/components/overtime/OverTimeWorkEdit'
import ErrorFallback from '@/components/ui/ErrorFallback'
import { safeSessionGet, safeSessionSet } from '@/lib/overtime-utils'
import type { OvertimeAllowanceItemDto, OvertimeAllowanceDetail } from '@/types/overtime'

const EDIT_DRAFT_KEY = 'overtimeEditDraft'
const PREVIEW_KEY = 'overtimeStubPreview'

export default function OverTimeTimePage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Number(params?.id)
  const id = isNaN(rawId) || rawId <= 0 ? undefined : rawId
  const { data: detail, isLoading, isError } = useOvertimeDetail(id)

  const handleLocalSave = useCallback((items: OvertimeAllowanceItemDto[]) => {
    if (!id) return

    // editDraft 업데이트
    safeSessionSet(EDIT_DRAFT_KEY, { id, details: items })

    // stubPreview도 업데이트 (뒤로 가면 stub에서 반영되도록)
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
  }, [id])

  useEffect(() => {
    if (!id) {
      router.replace('/overtime')
    }
  }, [id, router])

  if (!id) return null

  if (isError) return <ErrorFallback />

  if (isLoading) {
    return (
      <div className="container sub">
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          불러오는 중...
        </div>
      </div>
    )
  }

  return (
    <OverTimeWorkEdit
      overtimeId={id}
      initialData={detail}
      isPreview
      onPreviewSave={handleLocalSave}
    />
  )
}
