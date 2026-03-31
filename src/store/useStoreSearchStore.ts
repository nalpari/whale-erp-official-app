import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface StoreSearchState {
  status: string | null
  from: string
  to: string
  hasSearched: boolean
  setStatus: (status: string | null) => void
  setFrom: (from: string) => void
  setTo: (to: string) => void
  search: () => void
  reset: () => void
}

function getDefaultFrom(): string {
  return `${new Date().getFullYear()}-01-01`
}

function getDefaultTo(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const useStoreSearchStore = create<StoreSearchState>()(
  devtools(
    (set) => ({
      status: null,
      from: getDefaultFrom(),
      to: getDefaultTo(),
      hasSearched: false,
      setStatus: (status) => set({ status }, false, 'storeSearch/setStatus'),
      setFrom: (from) => set({ from }, false, 'storeSearch/setFrom'),
      setTo: (to) => set({ to }, false, 'storeSearch/setTo'),
      search: () => set({ hasSearched: true }, false, 'storeSearch/search'),
      reset: () => set({ status: null, from: getDefaultFrom(), to: getDefaultTo(), hasSearched: false }, false, 'storeSearch/reset'),
    }),
    { name: 'StoreSearchStore' },
  ),
)
