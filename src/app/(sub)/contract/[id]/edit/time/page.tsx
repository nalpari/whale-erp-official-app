'use client'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useContractDetail } from '@/hooks/queries/use-contract-queries'
import ContractEditTime from '@/components/contract/ContractEditTime'

export default function ContractEditTimePage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Number(params?.id)
  const id = isNaN(rawId) || rawId <= 0 ? undefined : rawId
  const { data: detail, isLoading } = useContractDetail(id)

  useEffect(() => {
    if (!id) {
      router.replace('/contract')
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

  return <ContractEditTime key={detail?.id} initialData={detail} />
}
