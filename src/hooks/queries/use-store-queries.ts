import { useQuery } from '@tanstack/react-query'
import { getHeadOffices, getHeadOfficeTree, getStoreOptions } from '@/lib/api/store'

export const storeKeys = {
  all: ['store'] as const,
  headOffices: () => [...storeKeys.all, 'head-offices'] as const,
  headOfficeTree: () => [...storeKeys.all, 'head-office-tree'] as const,
  options: (officeId?: number, franchiseId?: number) =>
    [...storeKeys.all, 'options', officeId, franchiseId] as const,
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

// 본사/가맹점 기반 점포 옵션
export const useStoreOptions = (officeId?: number, franchiseId?: number) => {
  return useQuery({
    queryKey: storeKeys.options(officeId, franchiseId),
    queryFn: () => getStoreOptions(officeId!, franchiseId),
    enabled: !!officeId,
  })
}
