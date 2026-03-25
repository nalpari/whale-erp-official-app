import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { StoreOption } from '@/types/store'

interface StoreState {
  selectedStore: StoreOption | null
  setSelectedStore: (store: StoreOption | null) => void
}

export const useStoreStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        selectedStore: null,
        setSelectedStore: (store) => set({ selectedStore: store }, false, 'setSelectedStore'),
      }),
      { name: 'store-selection' },
    ),
    { name: 'store-store' },
  ),
)
