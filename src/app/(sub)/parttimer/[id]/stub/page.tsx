'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePartTimerPayrollDetail } from '@/hooks/queries/use-parttime-payroll-queries'
import PartTimerPayStub from '@/components/parttimer/PartTimerPayStub'
import type { PartTimerPayrollDetail } from '@/types/parttime-payroll'

const PREVIEW_KEY = 'partTimerStubPreview'

export default function PartTimerPayDetailStub() {
  const params = useParams()
  const router = useRouter()
  const rawId = Number(params?.id)
  const id = isNaN(rawId) || rawId <= 0 ? undefined : rawId

  const [previewData] = useState<PartTimerPayrollDetail | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = sessionStorage.getItem(PREVIEW_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as PartTimerPayrollDetail
      // 현재 ID와 일치하는 경우에만 사용
      if (parsed.id !== undefined && parsed.id !== id) return null
      return parsed
    } catch {
      sessionStorage.removeItem(PREVIEW_KEY)
      return null
    }
  })

  const { data: detail, isLoading } = usePartTimerPayrollDetail(id)
  const data = previewData ?? detail

  useEffect(() => {
    if (!id) {
      router.replace('/parttimer')
    }
  }, [id, router])

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
