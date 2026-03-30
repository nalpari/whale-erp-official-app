import { useQuery } from '@tanstack/react-query'
import { getCommonCodeHierarchy } from '@/lib/api/common-code'
import type { CommonCodeNode } from '@/types/common-code'

export const commonCodeKeys = {
  all: ['common-code'] as const,
  hierarchy: (code: string) => [...commonCodeKeys.all, 'hierarchy', code] as const,
}

// 공통코드 계층 조회
export const useCommonCodeHierarchy = (code: string, enabled = true) => {
  return useQuery({
    queryKey: commonCodeKeys.hierarchy(code),
    queryFn: () => getCommonCodeHierarchy(code),
    enabled,
    staleTime: 10 * 60 * 1000,
  })
}

// 공통코드 code → name 변환 유틸
export const useCodeToName = (groupCode: string) => {
  const { data: codes = [] } = useCommonCodeHierarchy(groupCode)

  return (code: string | undefined | null): string => {
    if (!code) return '-'
    const found = codes.find((c: CommonCodeNode) => c.code === code)
    return found?.name ?? code
  }
}
