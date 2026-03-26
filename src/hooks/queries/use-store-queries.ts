import { useQuery } from '@tanstack/react-query'
import { getHeadOffices, getStoreOptions } from '@/lib/api/store'

export const storeKeys = {
  all: ['store'] as const,
  headOffices: () => [...storeKeys.all, 'head-offices'] as const,
  options: (officeId?: number) => [...storeKeys.all, 'options', officeId] as const,
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
