'use client'
import { useParams, useRouter } from 'next/navigation'
import { usePartTimerPayrollDetail } from '@/hooks/queries/use-parttime-payroll-queries'
import PartTimerPayStub from '@/components/parttimer/PartTimerPayStub'
import type { PartTimerPayrollDetail } from '@/types/parttime-payroll'

const PREVIEW_KEY = 'partTimerStubPreview'

const readPreview = (): PartTimerPayrollDetail | null => {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(PREVIEW_KEY)
  if (!raw) return null
  return JSON.parse(raw) as PartTimerPayrollDetail
}

export default function PartTimerPayDetailStub() {
  const params = useParams()
  const router = useRouter()
  const rawId = Number(params?.id)
  const id = isNaN(rawId) || rawId <= 0 ? undefined : rawId

  const previewData = readPreview()

  const { data: detail, isLoading } = usePartTimerPayrollDetail(id)
  const data = previewData ?? detail

  if (!id) {
    router.replace('/parttimer')
    return null
  }

  if (!data && isLoading) {
    return (
      <div className="container sub">
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          불러오는 중...
        </div>
      </div>
    )
  }

  return <PartTimerPayStub initialData={data} />
}
