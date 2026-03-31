import { useQuery } from '@tanstack/react-query'
import { getEmployeeListByType } from '@/lib/api/employee'
import type { GetEmployeeListByTypeParams } from '@/types/employee'

export const employeeKeys = {
  all: ['employee'] as const,
  byType: (params: GetEmployeeListByTypeParams) => [...employeeKeys.all, 'by-type', params] as const,
}

// 직원 타입별 목록 조회
export const useEmployeeListByType = (
  params: GetEmployeeListByTypeParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: employeeKeys.byType(params),
    queryFn: () => getEmployeeListByType(params),
    enabled: enabled && !!params.headOfficeId,
  })
}
