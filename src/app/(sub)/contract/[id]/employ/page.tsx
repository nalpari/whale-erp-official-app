'use client'
import ContractDetailPageWrapper from '@/components/contract/ContractDetailPageWrapper'
import EmploymentContract from '@/components/staff/EmploymentContract'

export default function ContractEmployPage() {
  return (
    <ContractDetailPageWrapper>
      {(detail) => <EmploymentContract key={detail.id} initialData={detail} />}
    </ContractDetailPageWrapper>
  )
}
