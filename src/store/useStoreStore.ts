import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { StoreOption, HeadOffice } from '@/types/store'

interface StoreState {
  selectedHeadOffice: HeadOffice | null
  selectedStore: StoreOption | null
  setSelectedHeadOffice: (office: HeadOffice | null) => void
  setSelectedStore: (store: StoreOption | null) => void
  setSelection: (office: HeadOffice | null, store: StoreOption | null) => void
  reset: () => void
}

export const useStoreStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        selectedHeadOffice: null,
        selectedStore: null,
        setSelectedHeadOffice: (office) =>
          set({ selectedHeadOffice: office, selectedStore: null }, false, 'setSelectedHeadOffice'),
        setSelectedStore: (store) =>
          set({ selectedStore: store }, false, 'setSelectedStore'),
        setSelection: (office, store) =>
          set({ selectedHeadOffice: office, selectedStore: store }, false, 'setSelection'),
        reset: () =>
          set({ selectedHeadOffice: null, selectedStore: null }, false, 'reset'),
      }),
      { name: 'store-selection' },
    ),
    { name: 'store-store' },
  ),
)
