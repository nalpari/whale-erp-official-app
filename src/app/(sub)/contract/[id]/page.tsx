'use client'
import ContractDetailPageWrapper from '@/components/contract/ContractDetailPageWrapper'
import ContractDetail from '@/components/contract/ContractDetail'

export default function ContractDetailPage() {
  return (
    <ContractDetailPageWrapper>
      {(detail) => <ContractDetail key={detail.id} initialData={detail} />}
    </ContractDetailPageWrapper>
  )
}
