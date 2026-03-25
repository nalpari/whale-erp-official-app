import { useQuery } from '@tanstack/react-query'
import { getStoreOptions } from '@/lib/api/store'

export const storeKeys = {
  all: ['store'] as const,
  options: () => [...storeKeys.all, 'options'] as const,
}

export const useStoreOptions = () => {
  return useQuery({
    queryKey: storeKeys.options(),
    queryFn: getStoreOptions,
  })
}
