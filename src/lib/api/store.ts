import api from '@/lib/api'
import type { StoreOption, HeadOffice, HeadOfficeTree } from '@/types/store'

// 운영중인 본사 목록 조회
export const getHeadOffices = async (): Promise<HeadOffice[]> => {
  const response = await api.get<{ data: HeadOffice[] }>('/api/master/bp/head-offices')
  return response.data.data
}

// 본사-가맹점 트리 조회
export const getHeadOfficeTree = async (): Promise<HeadOfficeTree[]> => {
  const response = await api.get<{ data: HeadOfficeTree[] }>('/api/master/bp/head-office-tree')
  return response.data.data
}

// 점포 드롭다운 목록 조회 (본사 또는 가맹점 ID 기반)
export const getStoreOptions = async (officeId: number, franchiseId?: number): Promise<StoreOption[]> => {
  const params: Record<string, number> = { officeId }
  if (franchiseId) params.franchiseId = franchiseId
  const response = await api.get<{ data: StoreOption[] }>('/api/v1/stores/options', { params })
  return response.data.data
}
