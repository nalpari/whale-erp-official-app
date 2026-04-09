'use client'
import { useCallback, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useOvertimeDetail } from '@/hooks/queries/use-overtime-queries'
import OverTimeWorkEdit from '@/components/overtime/OverTimeWorkEdit'
import ErrorFallback from '@/components/ui/ErrorFallback'
import { safeSessionSet, updateOvertimePreview, OVERTIME_SESSION_KEYS } from '@/lib/overtime-utils'
import type { OvertimeAllowanceItemDto } from '@/types/overtime'

const EDIT_DRAFT_KEY = OVERTIME_SESSION_KEYS.EDIT_DRAFT
const PREVIEW_KEY = OVERTIME_SESSION_KEYS.PREVIEW

export default function OverTimeTimePage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Number(params?.id)
  const id = isNaN(rawId) || rawId <= 0 ? undefined : rawId
  const { data: detail, isLoading, isError } = useOvertimeDetail(id)

  const handleLocalSave = useCallback((items: OvertimeAllowanceItemDto[]) => {
    if (!id) return

    // editDraft 업데이트
    safeSessionSet(EDIT_DRAFT_KEY, { id, details: items })

    // stubPreview도 업데이트 (뒤로 가면 stub에서 반영되도록)
    updateOvertimePreview(PREVIEW_KEY, items)
  }, [id])

  useEffect(() => {
    if (!id) {
      router.replace('/overtime')
    }
  }, [id, router])

  if (!id) return null

  if (isError) return <ErrorFallback />

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
