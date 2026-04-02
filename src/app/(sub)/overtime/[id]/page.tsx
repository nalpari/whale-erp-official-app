'use client'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useOvertimeDetail } from '@/hooks/queries/use-overtime-queries'
import OverTimeDetail from '@/components/overtime/OverTimeDetail'
import ErrorFallback from '@/components/ui/ErrorFallback'

export default function OverTimeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Number(params?.id)
  const id = isNaN(rawId) || rawId <= 0 ? undefined : rawId
  const { data: detail, isLoading, isError } = useOvertimeDetail(id)

  useEffect(() => {
    if (!id) {
      router.replace('/overtime')
    }
  }, [id, router])

  useEffect(() => {
    if (!isLoading && !isError && !detail && id) {
      router.replace('/overtime')
    }
  }, [isLoading, isError, detail, id, router])

  if (!id) return null

  if (isError) return <ErrorFallback showBack={false} />

  if (isLoading || !detail) {
    return (
      <div className="container sub">
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          불러오는 중...
        </div>
      </div>
    )
  }

  return <OverTimeDetail key={detail.id} initialData={detail} />
}
