'use client'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePartTimerPayrollDetail } from '@/hooks/queries/use-parttime-payroll-queries'
import PartTimerPayDetail from '@/components/parttimer/PartTimerPayDetail'

export default function PartTimerPayDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Number(params?.id)
  const id = isNaN(rawId) || rawId <= 0 ? undefined : rawId
  const { data: detail, isLoading } = usePartTimerPayrollDetail(id)

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

  if (!detail) {
    router.replace('/parttimer')
    return null
  }

  return <PartTimerPayDetail key={detail.id} initialData={detail} />
}
