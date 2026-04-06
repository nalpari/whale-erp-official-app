import api from '@/lib/api'
import type { EmployeeClassifyOption, EmployeeSimpleListItem, GetEmployeeListByTypeParams } from '@/types/employee'

// 직원 타입별 목록 조회
export const getEmployeeListByType = async (
  params: GetEmployeeListByTypeParams,
): Promise<EmployeeSimpleListItem[]> => {
  const queryParams: Record<string, string | number> = {
    headOfficeId: params.headOfficeId,
    employeeType: params.employeeType,
  }
  if (params.franchiseId) {
    queryParams.franchiseId = params.franchiseId
  }
  const response = await api.get<{ data: EmployeeSimpleListItem[] }>(
    '/api/v1/employee/info/by-type',
    { params: queryParams },
  )
  return response.data.data
}

// 직원 분류 공통코드 조회
export const getEmployeeInfoCommonCode = async (
  headOfficeId: number,
  franchiseId?: number,
): Promise<EmployeeClassifyOption[]> => {
  const params: Record<string, number> = { headOfficeId }
  if (franchiseId) params.franchiseId = franchiseId
  const response = await api.get<{
    data: { codeMemoContent: { EMPLOYEE?: EmployeeClassifyOption[] } | null } | null
  }>('/api/v1/employee/info/common-code', { params })
  return response.data.data?.codeMemoContent?.EMPLOYEE ?? []
}
