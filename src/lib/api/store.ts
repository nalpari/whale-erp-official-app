import api from '@/lib/api'
import type { StoreOption } from '@/types/store'

// 점포 드롭다운 목록 조회
export const getStoreOptions = async (): Promise<StoreOption[]> => {
  const response = await api.get<{ data: StoreOption[] }>('/api/v1/stores/options')
  return response.data.data
}
