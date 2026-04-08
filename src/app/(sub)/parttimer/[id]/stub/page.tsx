'use client'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePartTimerPayrollDetail } from '@/hooks/queries/use-parttime-payroll-queries'
import { useHeaderStore } from '@/store/useHeaderStore'
import PartTimerPayStub from '@/components/parttimer/PartTimerPayStub'
import type { PartTimerPayrollDetail } from '@/types/parttime-payroll'

const PREVIEW_KEY = 'partTimerStubPreview'

export default function PartTimerPayDetailStub() {
  const params = useParams()
  const router = useRouter()
  const rawId = Number(params?.id)
  const id = isNaN(rawId) || rawId <= 0 ? undefined : rawId

  const setOnBack = useHeaderStore((s) => s.setOnBack)
  const { data: detail, isLoading } = usePartTimerPayrollDetail(id)

  const previewData = (() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = sessionStorage.getItem(PREVIEW_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as PartTimerPayrollDetail
      if (parsed.id !== undefined && parsed.id !== id) return null
      return parsed
    } catch {
      sessionStorage.removeItem(PREVIEW_KEY)
      return null
    }
  })()

  const data = previewData ?? detail

  useEffect(() => {
    if (!id) {
      router.replace('/parttimer')
      return
    }
    setOnBack(() => router.push(`/parttimer/${id}`))
    return () => setOnBack(null)
  }, [id, router, setOnBack])

  if (!id) return null

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
