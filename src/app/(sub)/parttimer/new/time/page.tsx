'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PartTimerTimeEdit from '@/components/parttimer/PartTimerTimeEdit'
import type { PartTimerPayrollDetail, PartTimerPaymentItem } from '@/types/parttime-payroll'
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

  const [previewData] = useState<PartTimerPayrollDetail | null>(() => {
    if (typeof window === 'undefined') return null
    const raw = sessionStorage.getItem(PREVIEW_KEY)
    if (!raw) return null
    sessionStorage.removeItem(PREVIEW_KEY)
    return safeJsonParse<PartTimerPayrollDetail>(raw)
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

  const handlePreviewSave = useCallback((items: PartTimerPaymentItem[]) => {
    const raw = sessionStorage.getItem(PREVIEW_KEY)
    if (raw) {
      const data = safeJsonParse<PartTimerPayrollDetail>(raw)
      if (data) {
        data.paymentItems = items
        data.totalAmount = items.reduce((sum, i) => sum + i.totalAmount, 0)
        const deductionTotal = items.reduce((sum, i) => sum + i.deductionAmount, 0)
          + (data.deductionItems?.reduce((sum, i) => sum + i.amount, 0) ?? 0)
        data.totalDeductionAmount = deductionTotal
        data.actualPaymentAmount = data.totalAmount - deductionTotal
        sessionStorage.setItem(PREVIEW_KEY, JSON.stringify(data))
      }
    }

    const draftRaw = sessionStorage.getItem(DRAFT_KEY)
    if (draftRaw) {
      const draft = safeJsonParse<{ paymentItems?: PartTimerPaymentItem[] }>(draftRaw)
      if (draft) {
        draft.paymentItems = items
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
    />
  )
}
