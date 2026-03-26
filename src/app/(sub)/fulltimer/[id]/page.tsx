'use client'
import { useParams, useRouter } from 'next/navigation'
import { usePayrollDetail } from '@/hooks/queries/use-payroll-queries'
import FullTimerPayDetail from '@/components/fulltimer/FullTimerPayDetail'

export default function FullTimerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Number(params?.id)
  const id = isNaN(rawId) || rawId <= 0 ? undefined : rawId
  const { data: detail, isLoading } = usePayrollDetail(id)

  if (!id) {
    router.replace('/fulltimer')
    return null
  }

  if (isLoading) {
    return (
      <div className="container sub">
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          불러오는 중...
        </div>
      </div>
    )
  }

  return <FullTimerPayDetail key={detail?.id} initialData={detail} />
}
