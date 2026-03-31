import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ContractSearchParams } from '@/types/contract'

interface ContractSearchState {
  searchParams: ContractSearchParams
  hasSearched: boolean
  setSearchParams: (params: Partial<ContractSearchParams>) => void
  setPage: (page: number) => void
  search: () => void
  reset: () => void
}

const DEFAULT_PARAMS: ContractSearchParams = {
  page: 0,
  size: 20,
}

export const useContractSearchStore = create<ContractSearchState>()(
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
    { name: 'contract-search-store' },
  ),
)
