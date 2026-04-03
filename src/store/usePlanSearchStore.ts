import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getMonday, getSunday } from '@/lib/schedule-utils'

interface PlanSearchState {
  officeId: number | null
  franchiseId: number | null
  storeId: number | null
  employeeName: string
  dayType: string | null
  from: string | null
  to: string | null
  hasSearched: boolean
  setField: <K extends keyof PlanSearchFields>(key: K, value: PlanSearchFields[K]) => void
  setFields: (fields: Partial<PlanSearchFields>) => void
  search: () => void
  reset: () => void
}

type PlanSearchFields = Pick<
  PlanSearchState,
  'officeId' | 'franchiseId' | 'storeId' | 'employeeName' | 'dayType' | 'from' | 'to'
>

export const usePlanSearchStore = create<PlanSearchState>()(
  devtools(
    (set) => ({
      officeId: null,
      franchiseId: null,
      storeId: null,
      employeeName: '',
      dayType: null,
      from: null,
      to: null,
      hasSearched: false,
      setField: (key, value) => set({ [key]: value }, false, `planSearch/set-${key}`),
      setFields: (fields) => set(fields, false, 'planSearch/setFields'),
      search: () => set({ hasSearched: true }, false, 'planSearch/search'),
      reset: () =>
        set(
          {
            officeId: null,
            franchiseId: null,
            storeId: null,
            employeeName: '',
            dayType: null,
            from: getMonday(),
            to: getSunday(),
            hasSearched: false,
          },
          false,
          'planSearch/reset',
        ),
    }),
    { name: 'PlanSearchStore' },
  ),
)
