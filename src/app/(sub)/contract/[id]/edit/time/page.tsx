'use client'
import ContractDetailPageWrapper from '@/components/contract/ContractDetailPageWrapper'
import ContractEditTime from '@/components/contract/ContractEditTime'

export default function ContractEditTimePage() {
  return (
    <ContractDetailPageWrapper>
      {(detail) => <ContractEditTime key={detail.id} initialData={detail} />}
    </ContractDetailPageWrapper>
  )
}
