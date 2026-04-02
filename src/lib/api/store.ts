import api from '@/lib/api'
import type { StoreOption, HeadOffice } from '@/types/store'

// 운영중인 본사 목록 조회
export const getHeadOffices = async (): Promise<HeadOffice[]> => {
  const response = await api.get<{ data: HeadOffice[] }>('/api/v1/master/bp/head-offices')
  return response.data.data
}

// 본사-가맹점 트리 조회
export interface BpTreeNode {
  id: number
  name: string
  children?: BpTreeNode[]
}

export const getHeadOfficeTree = async (): Promise<BpTreeNode[]> => {
  const response = await api.get<{ data: BpTreeNode[] }>('/api/v1/master/bp/head-office-tree')
  return response.data.data
}

// 점포 드롭다운 목록 조회 (본사 ID 기반)
export const getStoreOptions = async (officeId: number): Promise<StoreOption[]> => {
  const response = await api.get<{ data: StoreOption[] }>('/api/v1/stores/options', {
    params: { officeId },
  })
  return response.data.data
}
