import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { EmployeeSearchParams } from '@/types/employee'

interface EmployeeSearchState {
  searchParams: EmployeeSearchParams
  hasSearched: boolean
  setSearchParams: (params: Partial<EmployeeSearchParams>) => void
  setPage: (page: number) => void
  search: () => void
  reset: () => void
}

const DEFAULT_PARAMS: EmployeeSearchParams = {
  page: 0,
  size: 20,
}

export const useEmployeeSearchStore = create<EmployeeSearchState>()(
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
    { name: 'employee-search-store' },
  ),
)
