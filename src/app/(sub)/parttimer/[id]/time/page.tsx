'use client'
import { useCallback, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePartTimerPayrollDetail } from '@/hooks/queries/use-parttime-payroll-queries'
import { useContractsByEmployee } from '@/hooks/queries/use-contract-queries'
import PartTimerTimeEdit from '@/components/parttimer/PartTimerTimeEdit'
import { normalizeBonusResponse } from '@/types/parttime-payroll'
import type { PartTimerPaymentItem, PartTimerPayrollDetail, PartTimerBonusDraft } from '@/types/parttime-payroll'

const EDIT_DRAFT_KEY = 'partTimerEditDraft'
const PREVIEW_KEY = 'partTimerStubPreview'

export default function PartTimerTimePage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Number(params?.id)
  const id = isNaN(rawId) || rawId <= 0 ? undefined : rawId
  const { data: detail, isLoading } = usePartTimerPayrollDetail(id)

  // 직원의 계약 정보에서 상여금/급여정보 조회
  const { data: contracts = [] } = useContractsByEmployee(
    detail?.memberId ?? 0,
    !!detail?.memberId,
  )
  const contractSalaryInfo = contracts[0]?.salaryInfo ?? undefined
  const contractWorkHours = contracts[0]?.workHours ?? undefined

  const handleLocalSave = useCallback((items: PartTimerPaymentItem[], bonuses: PartTimerBonusDraft[]) => {
    if (!id) return
    // 기존 draft에서 deductionItems 유지 (같은 ID인 경우만)
    const existingRaw = sessionStorage.getItem(EDIT_DRAFT_KEY)
    let existing: { id?: number; deductionItems?: unknown[] } = {}
    try {
      if (existingRaw) {
        const parsed = JSON.parse(existingRaw) as { id?: number }
        if (parsed.id === id) existing = parsed
      }
    } catch (e) { console.warn('EditDraft 파싱 실패:', e) }
    sessionStorage.setItem(EDIT_DRAFT_KEY, JSON.stringify({ ...existing, id, paymentItems: items, bonusItems: bonuses }))

    const bonusTotal = bonuses.reduce((sum, b) => sum + b.amount, 0)
    const bonusDeductionTotal = bonuses.reduce((sum, b) => sum + b.deductionAmount, 0)

    // stubPreview도 업데이트 — Draft → Response 형태로 변환
    const previewRaw = sessionStorage.getItem(PREVIEW_KEY)
    if (previewRaw) {
      try {
        const data = JSON.parse(previewRaw) as PartTimerPayrollDetail
        const previewBonuses = bonuses.map((b, i) => ({
          bonusName: b.bonusType,
          bonusAmount: b.amount,
          deductionAmount: b.deductionAmount,
          isActive: b.enabled,
          itemOrder: i + 1,
        }))
        const updated = {
          ...data,
          paymentItems: items,
          bonusItems: previewBonuses,
          totalAmount: items.reduce((sum, i) => sum + i.totalAmount, 0) + bonusTotal,
          totalDeductionAmount: items.reduce((sum, i) => sum + i.deductionAmount, 0)
            + (data.deductionItems?.reduce((sum, i) => sum + i.amount, 0) ?? 0)
            + bonusDeductionTotal,
        }
        updated.actualPaymentAmount = updated.totalAmount - updated.totalDeductionAmount
        sessionStorage.setItem(PREVIEW_KEY, JSON.stringify(updated))
      } catch (e) {
        console.warn('[PartTimerTimePage] previewData 업데이트 실패:', e)
      }
    }
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

  // 기존 저장된 상여금을 Draft 형태로 정규화
  const savedBonusItems = (detail?.bonusItems ?? []).map(normalizeBonusResponse)

  return (
    <PartTimerTimeEdit
      payrollId={id}
      initialData={detail}
      isPreview
      onPreviewSave={handleLocalSave}
      initialBonusItems={savedBonusItems.length > 0 ? savedBonusItems : undefined}
      contractSalaryInfo={contractSalaryInfo}
      contractWorkHours={contractWorkHours}
    />
  )
}
