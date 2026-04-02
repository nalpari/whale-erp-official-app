'use client'
import { useCallback, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useOvertimeDetail } from '@/hooks/queries/use-overtime-queries'
import OverTimeWorkEdit from '@/components/overtime/OverTimeWorkEdit'
import type { OvertimeAllowanceItemDto } from '@/types/overtime'

const EDIT_DRAFT_KEY = 'overtimeEditDraft'

export default function OverTimeTimePage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Number(params?.id)
  const id = isNaN(rawId) || rawId <= 0 ? undefined : rawId
  const { data: detail, isLoading } = useOvertimeDetail(id)

  const handleLocalSave = useCallback((items: OvertimeAllowanceItemDto[]) => {
    if (!id) return
    sessionStorage.setItem(EDIT_DRAFT_KEY, JSON.stringify({ id, details: items }))
  }, [id])

  useEffect(() => {
    if (!id) {
      router.replace('/overtime')
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

  return (
    <OverTimeWorkEdit
      overtimeId={id}
      initialData={detail}
      isPreview
      onPreviewSave={handleLocalSave}
    />
  )
}
