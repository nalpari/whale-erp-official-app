import api from '@/lib/api'
import type { StoreOption, HeadOffice } from '@/types/store'

// 운영중인 본사 목록 조회
export const getHeadOffices = async (): Promise<HeadOffice[]> => {
  const response = await api.get<{ data: HeadOffice[] }>('/api/master/bp/head-offices')
  return response.data.data
}

// 점포 드롭다운 목록 조회 (본사 ID 기반)
export const getStoreOptions = async (officeId?: number): Promise<StoreOption[]> => {
  const params: Record<string, number> = {}
  if (officeId) params.officeId = officeId
  const response = await api.get<{ data: StoreOption[] }>('/api/v1/stores/options', { params })
  return response.data.data
}
