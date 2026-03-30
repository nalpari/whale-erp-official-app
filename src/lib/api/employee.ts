import api from '@/lib/api'
import type { EmployeeSimpleListItem, GetEmployeeListByTypeParams } from '@/types/employee'

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
    '/api/employee/info/by-type',
    { params: queryParams },
  )
  return response.data.data
}
