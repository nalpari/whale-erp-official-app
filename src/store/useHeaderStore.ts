import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface HeaderState {
  onDelete: (() => void) | null
  setOnDelete: (handler: (() => void) | null) => void
}

export const useHeaderStore = create<HeaderState>()(
  devtools(
    (set) => ({
      onDelete: null,
      setOnDelete: (handler) => set({ onDelete: handler }, false, 'header/setOnDelete'),
    }),
    { name: 'HeaderStore' },
  ),
)
