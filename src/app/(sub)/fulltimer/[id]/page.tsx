'use client'
import { useParams } from 'next/navigation'
import { usePayrollDetail } from '@/hooks/queries/use-payroll-queries'
import FullTimerPayDetail from '@/components/fulltimer/FullTimerPayDetail'

export default function FullTimerDetailPage() {
  const params = useParams()
  const id = Number(params?.id)
  const { data: detail, isLoading } = usePayrollDetail(id)

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
