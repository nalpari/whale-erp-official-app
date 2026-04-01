import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface PlanSearchState {
  officeId: number | null
  franchiseId: number | null
  storeId: number | null
  employeeName: string
  dayType: string | null
  from: string
  to: string
  hasSearched: boolean
  setField: <K extends keyof PlanSearchFields>(key: K, value: PlanSearchFields[K]) => void
  search: () => void
  reset: () => void
}

type PlanSearchFields = Pick<
  PlanSearchState,
  'officeId' | 'franchiseId' | 'storeId' | 'employeeName' | 'dayType' | 'from' | 'to'
>

import { getMonday, getSunday } from '@/lib/schedule-utils'

export const usePlanSearchStore = create<PlanSearchState>()(
  devtools(
    (set) => ({
      officeId: null,
      franchiseId: null,
      storeId: null,
      employeeName: '',
      dayType: null,
      from: getMonday(),
      to: getSunday(),
      hasSearched: false,
      setField: (key, value) => set({ [key]: value }, false, `planSearch/set-${key}`),
      search: () => set({ hasSearched: true }, false, 'planSearch/search'),
      reset: () =>
        set(
          {
            officeId: null,
            franchiseId: null,
            storeId: null,
            employeeName: '',
            dayType: null,
            from: '',
            to: '',
            hasSearched: false,
          },
          false,
          'planSearch/reset',
        ),
    }),
    { name: 'PlanSearchStore' },
  ),
)
