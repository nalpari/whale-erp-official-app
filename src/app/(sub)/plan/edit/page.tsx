import { Suspense } from 'react'
import PlanTableEdit from '@/components/plan/PlanTableEdit'

export default function PlanEditPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>로딩 중...</div>}>
      <PlanTableEdit />
    </Suspense>
  )
}
