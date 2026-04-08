'use client'
import { useCallback, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePartTimerPayrollDetail } from '@/hooks/queries/use-parttime-payroll-queries'
import { useContractsByEmployee } from '@/hooks/queries/use-contract-queries'
import PartTimerTimeEdit from '@/components/parttimer/PartTimerTimeEdit'
import type { PartTimerPaymentItem, PartTimerPayrollDetail, PartTimerBonusItem } from '@/types/parttime-payroll'

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

  const handleLocalSave = useCallback((items: PartTimerPaymentItem[], bonuses: PartTimerBonusItem[]) => {
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

    const bonusTotal = bonuses.reduce((sum, b) => sum + (b.amount ?? 0), 0)
    const bonusDeductionTotal = bonuses.reduce((sum, b) => sum + (b.deductionAmount ?? 0), 0)

    // stubPreview도 업데이트 (stub에서 반영되도록)
    const previewRaw = sessionStorage.getItem(PREVIEW_KEY)
    if (previewRaw) {
      try {
        const data = JSON.parse(previewRaw) as PartTimerPayrollDetail & { bonusItems?: PartTimerBonusItem[] }
        data.paymentItems = items
        data.bonusItems = bonuses
        data.totalAmount = items.reduce((sum, i) => sum + i.totalAmount, 0) + bonusTotal
        const deductionTotal = items.reduce((sum, i) => sum + i.deductionAmount, 0)
          + (data.deductionItems?.reduce((sum, i) => sum + i.amount, 0) ?? 0)
          + bonusDeductionTotal
        data.totalDeductionAmount = deductionTotal
        data.actualPaymentAmount = data.totalAmount - deductionTotal
        sessionStorage.setItem(PREVIEW_KEY, JSON.stringify(data))
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

  // 기존 저장된 상여금이 있으면 우선, 없으면 계약 기반 상여금 사용
  const savedBonusItems: PartTimerBonusItem[] = (detail?.bonusItems ?? []).map((b) => ({
    bonusCode: b.bonusCode ?? String(b.id ?? ''),
    bonusType: b.bonusName ?? b.bonusType ?? '',
    amount: b.bonusAmount ?? b.amount ?? 0,
    deductionAmount: b.deductionAmount ?? 0,
    enabled: b.isActive ?? (b.enabled ?? true),
    memo: b.memo,
  }))

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
