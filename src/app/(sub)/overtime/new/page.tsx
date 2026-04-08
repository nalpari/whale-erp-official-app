'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useHeaderStore } from '@/store/useHeaderStore'
import OverTimeDetail from '@/components/overtime/OverTimeDetail'

export default function OverTimeNewPage() {
  const router = useRouter()
  const setOnBack = useHeaderStore((s) => s.setOnBack)

  useEffect(() => {
    setOnBack(() => router.push('/overtime'))
    return () => setOnBack(null)
  }, [router, setOnBack])

  return <OverTimeDetail isNew />
}
