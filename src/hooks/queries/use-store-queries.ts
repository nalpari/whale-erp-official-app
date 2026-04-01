import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getHeadOffices,
  getHeadOfficeTree,
  getStoreOptions,
  getStoreList,
  getStoreDetail,
  createStore,
  updateStore,
  deleteStore,
} from '@/lib/api/store'
import type { StoreSearchParams, StoreHeaderRequest } from '@/types/store'

export const storeKeys = {
  all: ['store'] as const,
  headOffices: () => [...storeKeys.all, 'head-offices'] as const,
  headOfficeTree: () => [...storeKeys.all, 'head-office-tree'] as const,
  options: (officeId?: number, franchiseId?: number) => [...storeKeys.all, 'options', officeId, franchiseId] as const,
  list: (params: Omit<StoreSearchParams, 'page'>) => [...storeKeys.all, 'list', params] as const,
  detail: (id?: number) => [...storeKeys.all, 'detail', id] as const,
}

// 운영중인 본사 목록
export const useHeadOffices = () => {
  return useQuery({
    queryKey: storeKeys.headOffices(),
    queryFn: getHeadOffices,
  })
}

// 본사-가맹점 트리
export const useHeadOfficeTree = () => {
  return useQuery({
    queryKey: storeKeys.headOfficeTree(),
    queryFn: getHeadOfficeTree,
  })
}

// 본사/가맹점 ID 기반 점포 옵션
export const useStoreOptions = (officeId?: number, franchiseId?: number) => {
  return useQuery({
    queryKey: storeKeys.options(officeId, franchiseId),
    queryFn: () => {
      if (!officeId) throw new Error('officeId가 없습니다.')
      return getStoreOptions(officeId, franchiseId ?? undefined)
    },
    enabled: !!officeId,
  })
}

// 점포 목록 조회 (무한 스크롤)
export const useStoreInfiniteList = (params: Omit<StoreSearchParams, 'page'>, enabled = true) => {
  return useInfiniteQuery({
    queryKey: storeKeys.list(params),
    queryFn: ({ pageParam }) => getStoreList({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hasNext ? lastPageParam + 1 : undefined,
    enabled,
  })
}

// 점포 상세 조회
export const useStoreDetail = (id?: number) => {
  return useQuery({
    queryKey: storeKeys.detail(id),
    queryFn: () => {
      if (!id) throw new Error('id가 없습니다.')
      return getStoreDetail(id)
    },
    enabled: !!id,
  })
}

// 점포 생성 (mutateAsync + try/catch 전용 — mutate() 단독 사용 금지)
export const useCreateStore = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data, storeImages, businessFile }: {
      data: StoreHeaderRequest
      storeImages?: File[]
      businessFile?: File
    }) => createStore(data, storeImages, businessFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all })
    },
    onError: (err) => {
      console.error('[useCreateStore] 점포 생성 실패:', err)
    },
  })
}

// 점포 수정 (mutateAsync + try/catch 전용 — mutate() 단독 사용 금지)
export const useUpdateStore = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data, deleteImages, storeImages, businessFile }: {
      id: number
      data: StoreHeaderRequest
      deleteImages?: number[]
      storeImages?: File[]
      businessFile?: File
    }) => updateStore(id, data, deleteImages, storeImages, businessFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all })
    },
    onError: (err) => {
      console.error('[useUpdateStore] 점포 수정 실패:', err)
    },
  })
}

// 점포 삭제 (mutateAsync + try/catch 전용 — mutate() 단독 사용 금지)
export const useDeleteStore = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all })
    },
    onError: (err) => {
      console.error('[useDeleteStore] 점포 삭제 실패:', err)
    },
  })
}
