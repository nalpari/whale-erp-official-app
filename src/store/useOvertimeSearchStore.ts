import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { OvertimeSearchParams } from '@/types/overtime'

interface OvertimeSearchState {
  searchParams: OvertimeSearchParams
  hasSearched: boolean
  setSearchParams: (params: Partial<OvertimeSearchParams>) => void
  setPage: (page: number) => void
  search: () => void
  reset: () => void
}

const DEFAULT_PARAMS: OvertimeSearchParams = {
  page: 0,
  size: 20,
}

export const useOvertimeSearchStore = create<OvertimeSearchState>()(
  devtools(
    (set) => ({
      searchParams: { ...DEFAULT_PARAMS },
      hasSearched: false,
      setSearchParams: (params) =>
        set(
          (state) => ({
            searchParams: { ...state.searchParams, ...params },
          }),
          false,
          'setSearchParams',
        ),
      setPage: (page) =>
        set(
          (state) => ({
            searchParams: { ...state.searchParams, page },
          }),
          false,
          'setPage',
        ),
      search: () =>
        set(
          (state) => ({
            hasSearched: true,
            searchParams: { ...state.searchParams, page: 0 },
          }),
          false,
          'search',
        ),
      reset: () =>
        set(
          { searchParams: { ...DEFAULT_PARAMS }, hasSearched: false },
          false,
          'reset',
        ),
    }),
    { name: 'overtime-search-store' },
  ),
)
