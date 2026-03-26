import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { PayrollSearchParams } from '@/types/payroll'

interface PayrollSearchState {
  searchParams: PayrollSearchParams
  hasSearched: boolean
  setSearchParams: (params: Partial<PayrollSearchParams>) => void
  setPage: (page: number) => void
  search: () => void
  reset: () => void
}

const DEFAULT_PARAMS: PayrollSearchParams = {
  page: 0,
  size: 20,
}

export const usePayrollSearchStore = create<PayrollSearchState>()(
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
    { name: 'payroll-search-store' },
  ),
)
