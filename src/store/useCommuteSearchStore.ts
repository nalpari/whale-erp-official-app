import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { AttendanceListParams } from '@/types/commute'

type SearchFields = Omit<AttendanceListParams, 'officeId' | 'franchiseId' | 'storeId'>

interface CommuteSearchState {
  searchParams: SearchFields
  hasSearched: boolean
  setSearchParams: (params: Partial<SearchFields>) => void
  search: () => void
  reset: () => void
}

const DEFAULT_PARAMS: SearchFields = {
  page: 0,
  size: 50,
}

export const useCommuteSearchStore = create<CommuteSearchState>()(
  devtools(
    (set) => ({
      searchParams: { ...DEFAULT_PARAMS },
      hasSearched: false,
      setSearchParams: (params) =>
        set(
          (state) => ({ searchParams: { ...state.searchParams, ...params } }),
          false,
          'setSearchParams',
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
    { name: 'commute-search-store' },
  ),
)
