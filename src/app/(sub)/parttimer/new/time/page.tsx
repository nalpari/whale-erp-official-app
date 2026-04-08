'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PartTimerTimeEdit from '@/components/parttimer/PartTimerTimeEdit'
import type { PartTimerPayrollDetail, PartTimerPaymentItem, PartTimerBonusItem } from '@/types/parttime-payroll'
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

  const [{ previewData, savedBonusItems }] = useState<{ previewData: PartTimerPayrollDetail | null; savedBonusItems: PartTimerBonusItem[] }>(() => {
    if (typeof window === 'undefined') return { previewData: null, savedBonusItems: [] }
    const raw = sessionStorage.getItem(PREVIEW_KEY)
    if (!raw) return { previewData: null, savedBonusItems: [] }
    const parsed = safeJsonParse<PartTimerPayrollDetail & { bonusItems?: PartTimerBonusItem[] }>(raw)
    return { previewData: parsed, savedBonusItems: parsed?.bonusItems ?? [] }
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

  const handlePreviewSave = useCallback((items: PartTimerPaymentItem[], bonuses: PartTimerBonusItem[]) => {
    const bonusTotal = bonuses.reduce((sum, b) => sum + (b.amount ?? 0), 0)
    const bonusDeductionTotal = bonuses.reduce((sum, b) => sum + (b.deductionAmount ?? 0), 0)

    const raw = sessionStorage.getItem(PREVIEW_KEY)
    if (raw) {
      const data = safeJsonParse<PartTimerPayrollDetail & { bonusItems?: PartTimerBonusItem[] }>(raw)
      if (data) {
        data.paymentItems = items
        data.bonusItems = bonuses
        data.totalAmount = items.reduce((sum, i) => sum + i.totalAmount, 0) + bonusTotal
        const deductionTotal = items.reduce((sum, i) => sum + i.deductionAmount, 0)
          + (data.deductionItems?.reduce((sum, i) => sum + i.amount, 0) ?? 0)
          + bonusDeductionTotal
        data.totalDeductionAmount = deductionTotal
        data.actualPaymentAmount = data.totalAmount - deductionTotal
        sessionStorage.setItem(PREVIEW_KEY, JSON.stringify(data))
      }
    }

    const draftRaw = sessionStorage.getItem(DRAFT_KEY)
    if (draftRaw) {
      const draft = safeJsonParse<{ paymentItems?: PartTimerPaymentItem[]; bonusItems?: PartTimerBonusItem[] }>(draftRaw)
      if (draft) {
        draft.paymentItems = items
        draft.bonusItems = bonuses
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
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
