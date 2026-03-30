import api from '@/lib/api'
import type { CommonCodeNode } from '@/types/common-code'

// 공통코드 계층 조회
export const getCommonCodeHierarchy = async (code: string): Promise<CommonCodeNode[]> => {
  const response = await api.get<{ data: CommonCodeNode }>(`/api/v1/common-codes/hierarchy/${code}`)
  const root = response.data.data

  if (!root.isActive) {
    throw new Error(`${code} 공통코드가 비활성 상태입니다.`)
  }

  return root.children ?? []
}
