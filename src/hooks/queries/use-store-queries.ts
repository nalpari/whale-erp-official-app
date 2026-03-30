import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getHeadOffices,
  getStoreOptions,
  getStoreList,
  getStoreDetail,
  createStore,
  updateStore,
  deleteStore,
  getAuthorityDetail,
} from '@/lib/api/store'
import type { StoreSearchParams, StoreHeaderRequest } from '@/types/store'

export const storeKeys = {
  all: ['store'] as const,
  headOffices: () => [...storeKeys.all, 'head-offices'] as const,
  options: (officeId?: number, franchiseId?: number) => [...storeKeys.all, 'options', officeId, franchiseId] as const,
  list: (params: StoreSearchParams) => [...storeKeys.all, 'list', params] as const,
  detail: (id?: number) => [...storeKeys.all, 'detail', id] as const,
  authority: (id?: string | number) => [...storeKeys.all, 'authority', id] as const,
}

// 운영중인 본사 목록
export const useHeadOffices = () => {
  return useQuery({
    queryKey: storeKeys.headOffices(),
    queryFn: getHeadOffices,
  })
}

// 본사/가맹점 ID 기반 점포 옵션
export const useStoreOptions = (officeId?: number, franchiseId?: number) => {
  return useQuery({
    queryKey: storeKeys.options(officeId, franchiseId),
    queryFn: () => getStoreOptions(officeId!, franchiseId ?? undefined),
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

// 권한 상세 조회
export const useAuthorityDetail = (id?: string | number | null) => {
  return useQuery({
    queryKey: storeKeys.authority(id ?? undefined),
    queryFn: () => getAuthorityDetail(id!),
    enabled: !!id,
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
