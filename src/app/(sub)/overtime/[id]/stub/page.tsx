'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useOvertimeDetail } from '@/hooks/queries/use-overtime-queries'
import OverTimeStub from '@/components/overtime/OverTimeStub'
import ErrorFallback from '@/components/ui/ErrorFallback'
import type { OvertimeAllowanceDetail } from '@/types/overtime'

const PREVIEW_KEY = 'overtimeStubPreview'

export default function OverTimeStubPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Number(params?.id)
  const id = isNaN(rawId) || rawId <= 0 ? undefined : rawId

  const [previewData] = useState<OvertimeAllowanceDetail | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = sessionStorage.getItem(PREVIEW_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as OvertimeAllowanceDetail
      if (parsed.id !== undefined && parsed.id !== id) return null
      return parsed
    } catch (err) {
      console.warn('[OverTimeStubPage] sessionStorage 파싱 실패:', err)
      sessionStorage.removeItem(PREVIEW_KEY)
      return null
    }
  })

  const { data: detail, isLoading, isError } = useOvertimeDetail(id)
  const data = previewData ?? detail

  useEffect(() => {
    if (!id) {
      router.replace('/overtime')
    }
  }, [id, router])

  if (!id) return null

  if (isError) return <ErrorFallback />

  if (!data && isLoading) {
    return (
      <div className="container sub">
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          불러오는 중...
        </div>
      </div>
    )
  }

  return <OverTimeStub initialData={data} />
}
