import PlanTableEdit from '@/components/plan/PlanTableEdit'

export default async function PlanEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PlanTableEdit storeId={Number(id)} />
}
