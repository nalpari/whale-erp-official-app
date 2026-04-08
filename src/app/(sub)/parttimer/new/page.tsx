'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useHeaderStore } from '@/store/useHeaderStore'
import PartTimerPayDetail from '@/components/parttimer/PartTimerPayDetail'

export default function PartTimerNewPage() {
  const router = useRouter()
  const setOnBack = useHeaderStore((s) => s.setOnBack)

  useEffect(() => {
    setOnBack(() => router.push('/parttimer'))
    return () => setOnBack(null)
  }, [router, setOnBack])

  return <PartTimerPayDetail isNew />
}
