import { redirect } from 'next/navigation'

interface LegacyPlanPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function appendSearchParams(
  urlSearchParams: URLSearchParams,
  searchParams: Record<string, string | string[] | undefined>,
) {
  for (const [key, value] of Object.entries(searchParams)) {
    if (value == null) continue
    if (Array.isArray(value)) {
      for (const item of value) {
        urlSearchParams.append(key, item)
      }
      continue
    }
    urlSearchParams.set(key, value)
  }
}

export default async function LegacyPlanPage({
  params,
  searchParams,
}: LegacyPlanPageProps) {
  const { id } = await params
  const resolvedSearchParams = await searchParams
  const nextSearchParams = new URLSearchParams()

  appendSearchParams(nextSearchParams, resolvedSearchParams)

  if (!nextSearchParams.has('storeId') && id) {
    nextSearchParams.set('storeId', id)
  }

  const target = nextSearchParams.toString()
    ? `/plan/edit?${nextSearchParams.toString()}`
    : '/plan/edit'

  redirect(target)
}
