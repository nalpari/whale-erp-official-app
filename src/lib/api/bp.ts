import api from '@/lib/api'
import type { BpHeadOfficeNode } from '@/types/bp'

// 본사-가맹점 계층 트리 조회
export const getBpTree = async (): Promise<BpHeadOfficeNode[]> => {
  const response = await api.get<{ data: BpHeadOfficeNode[] }>(
    '/api/v1/master/bp/head-office-tree'
  )
  return response.data.data
}
