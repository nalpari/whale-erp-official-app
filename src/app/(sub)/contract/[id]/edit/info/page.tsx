'use client'
import ContractDetailPageWrapper from '@/components/contract/ContractDetailPageWrapper'
import ContractEditInfo from '@/components/contract/ContractEditInfo'

export default function ContractEditInfoPage() {
  return (
    <ContractDetailPageWrapper>
      {(detail) => <ContractEditInfo key={detail.id} initialData={detail} />}
    </ContractDetailPageWrapper>
  )
}
