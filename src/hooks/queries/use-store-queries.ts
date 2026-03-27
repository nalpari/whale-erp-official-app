import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getHeadOffices,
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
  options: (officeId?: number) => [...storeKeys.all, 'options', officeId] as const,
  list: (params: StoreSearchParams) => [...storeKeys.all, 'list', params] as const,
  detail: (id?: number) => [...storeKeys.all, 'detail', id] as const,
}

// 운영중인 본사 목록
export const useHeadOffices = () => {
  return useQuery({
    queryKey: storeKeys.headOffices(),
    queryFn: getHeadOffices,
  })
}

// 본사 ID 기반 점포 옵션
export const useStoreOptions = (officeId?: number) => {
  return useQuery({
    queryKey: storeKeys.options(officeId),
    queryFn: () => getStoreOptions(officeId!),
    enabled: !!officeId,
  })
}

// 점포 목록 조회
export const useStoreList = (params: StoreSearchParams, enabled = true) => {
  return useQuery({
    queryKey: storeKeys.list(params),
    queryFn: () => getStoreList(params),
    enabled,
  })
}

// 점포 상세 조회
export const useStoreDetail = (id?: number) => {
  return useQuery({
    queryKey: storeKeys.detail(id),
    queryFn: () => getStoreDetail(id!),
    enabled: !!id,
  })
}

// 점포 생성
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
  })
}

// 점포 수정
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
  })
}

// 점포 삭제
export const useDeleteStore = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all })
    },
  })
}
