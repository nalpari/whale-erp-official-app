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

function getMonday(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().slice(0, 10)
}

function getSunday(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? 0 : 7)
  d.setDate(diff)
  return d.toISOString().slice(0, 10)
}

const now = new Date()
const defaultFrom = getMonday(now)
const defaultTo = getSunday(now)

export const usePlanSearchStore = create<PlanSearchState>()(
  devtools(
    (set) => ({
      officeId: null,
      franchiseId: null,
      storeId: null,
      employeeName: '',
      dayType: null,
      from: defaultFrom,
      to: defaultTo,
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
            from: defaultFrom,
            to: defaultTo,
            hasSearched: false,
          },
          false,
          'planSearch/reset',
        ),
    }),
    { name: 'PlanSearchStore' },
  ),
)
