'use client'
import { useState, useCallback } from 'react'
import { redirect } from 'next/navigation'
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

export default function PartTimerNewTimePage() {
  const [previewData] = useState<PartTimerPayrollDetail | null>(() => {
    if (typeof window === 'undefined') return null
    const raw = sessionStorage.getItem(PREVIEW_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PartTimerPayrollDetail
  })

  const [contractData] = useState<DraftContractData>(() => {
    if (typeof window === 'undefined') return {}
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return {}
    const draft = JSON.parse(raw) as DraftContractData
    return { contractWage: draft.contractWage, contractWorkHours: draft.contractWorkHours, contractSalaryInfo: draft.contractSalaryInfo }
  })

  const handlePreviewSave = useCallback((items: PartTimerPaymentItem[]) => {
    // stub preview 데이터 업데이트
    const raw = sessionStorage.getItem(PREVIEW_KEY)
    if (raw) {
      const data = JSON.parse(raw) as PartTimerPayrollDetail
      data.paymentItems = items
      data.totalAmount = items.reduce((sum, i) => sum + i.totalAmount, 0)
      const deductionTotal = items.reduce((sum, i) => sum + i.deductionAmount, 0)
        + (data.deductionItems?.reduce((sum, i) => sum + i.amount, 0) ?? 0)
      data.totalDeductionAmount = deductionTotal
      data.actualPaymentAmount = data.totalAmount - deductionTotal
      sessionStorage.setItem(PREVIEW_KEY, JSON.stringify(data))
    }

    // form draft 데이터도 업데이트
    const draftRaw = sessionStorage.getItem(DRAFT_KEY)
    if (draftRaw) {
      const draft = JSON.parse(draftRaw)
      draft.paymentItems = items
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    }
  }, [])

  if (!previewData) {
    redirect('/parttimer/new')
  }

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
