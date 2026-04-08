'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PartTimerTimeEdit from '@/components/parttimer/PartTimerTimeEdit'
import { normalizeBonusResponse } from '@/types/parttime-payroll'
import type { PartTimerPayrollDetail, PartTimerPaymentItem, PartTimerBonusDraft } from '@/types/parttime-payroll'
import type { ContractWorkHour, ContractSalaryInfo } from '@/types/contract'

const PREVIEW_KEY = 'partTimerStubPreview'
const DRAFT_KEY = 'partTimerFormDraft'

interface DraftContractData {
  contractWage?: number
  contractWorkHours?: ContractWorkHour[]
  contractSalaryInfo?: ContractSalaryInfo
}

const safeJsonParse = <T,>(raw: string): T | null => {
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export default function PartTimerNewTimePage() {
  const router = useRouter()

  const [{ previewData, savedBonusItems }] = useState<{ previewData: PartTimerPayrollDetail | null; savedBonusItems: PartTimerBonusDraft[] }>(() => {
    if (typeof window === 'undefined') return { previewData: null, savedBonusItems: [] }
    const raw = sessionStorage.getItem(PREVIEW_KEY)
    if (!raw) return { previewData: null, savedBonusItems: [] }
    const parsed = safeJsonParse<PartTimerPayrollDetail>(raw)
    return { previewData: parsed, savedBonusItems: (parsed?.bonusItems ?? []).map(normalizeBonusResponse) }
  })

  const [contractData] = useState<DraftContractData>(() => {
    if (typeof window === 'undefined') return {}
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return {}
    const draft = safeJsonParse<DraftContractData>(raw)
    if (!draft) return {}
    return { contractWage: draft.contractWage, contractWorkHours: draft.contractWorkHours, contractSalaryInfo: draft.contractSalaryInfo }
  })

  useEffect(() => {
    if (!previewData) {
      router.replace('/parttimer/new')
    }
  }, [previewData, router])

  const handlePreviewSave = useCallback((items: PartTimerPaymentItem[], bonuses: PartTimerBonusDraft[]) => {
    const bonusTotal = bonuses.reduce((sum, b) => sum + b.amount, 0)
    const bonusDeductionTotal = bonuses.reduce((sum, b) => sum + b.deductionAmount, 0)

    // Draft → Response 형태로 변환하여 preview에 저장
    const previewBonuses = bonuses.map((b, i) => ({
      bonusName: b.bonusType,
      bonusAmount: b.amount,
      deductionAmount: b.deductionAmount,
      isActive: b.enabled,
      itemOrder: i + 1,
    }))

    const raw = sessionStorage.getItem(PREVIEW_KEY)
    if (raw) {
      const data = safeJsonParse<PartTimerPayrollDetail>(raw)
      if (data) {
        const totalAmount = items.reduce((sum, i) => sum + i.totalAmount, 0) + bonusTotal
        const deductionTotal = items.reduce((sum, i) => sum + i.deductionAmount, 0)
          + (data.deductionItems?.reduce((sum, i) => sum + i.amount, 0) ?? 0)
          + bonusDeductionTotal
        const updated = {
          ...data,
          paymentItems: items,
          bonusItems: previewBonuses,
          totalAmount,
          totalDeductionAmount: deductionTotal,
          actualPaymentAmount: totalAmount - deductionTotal,
        }
        sessionStorage.setItem(PREVIEW_KEY, JSON.stringify(updated))
      }
    }

    const draftRaw = sessionStorage.getItem(DRAFT_KEY)
    if (draftRaw) {
      const draft = safeJsonParse<{ paymentItems?: PartTimerPaymentItem[]; bonusItems?: PartTimerBonusDraft[] }>(draftRaw)
      if (draft) {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, paymentItems: items, bonusItems: bonuses }))
      }
    }
  }, [])

  if (!previewData) return null

  return (
    <PartTimerTimeEdit
      initialData={previewData}
      isPreview
      onPreviewSave={handlePreviewSave}
      contractWage={contractData.contractWage}
      contractWorkHours={contractData.contractWorkHours}
      contractSalaryInfo={contractData.contractSalaryInfo}
      initialBonusItems={savedBonusItems}
    />
  )
}
