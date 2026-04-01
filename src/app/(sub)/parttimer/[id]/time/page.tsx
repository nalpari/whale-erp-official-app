'use client'
import { useCallback, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePartTimerPayrollDetail } from '@/hooks/queries/use-parttime-payroll-queries'
import PartTimerTimeEdit from '@/components/parttimer/PartTimerTimeEdit'
import type { PartTimerPaymentItem } from '@/types/parttime-payroll'

const EDIT_DRAFT_KEY = 'partTimerEditDraft'

export default function PartTimerTimePage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Number(params?.id)
  const id = isNaN(rawId) || rawId <= 0 ? undefined : rawId
  const { data: detail, isLoading } = usePartTimerPayrollDetail(id)

  const handleLocalSave = useCallback((items: PartTimerPaymentItem[]) => {
    if (!id) return
    // 기존 draft에서 deductionItems 유지
    const existingRaw = sessionStorage.getItem(EDIT_DRAFT_KEY)
    let existing = {}
    try { if (existingRaw) existing = JSON.parse(existingRaw) } catch { /* ignore */ }
    sessionStorage.setItem(EDIT_DRAFT_KEY, JSON.stringify({ ...existing, id, paymentItems: items }))
  }, [id])

  useEffect(() => {
    if (!id) {
      router.replace('/parttimer')
    }
  }, [id, router])

  if (!id) return null

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
    <PartTimerTimeEdit
      payrollId={id}
      initialData={detail}
      isPreview
      onPreviewSave={handleLocalSave}
    />
  )
}
