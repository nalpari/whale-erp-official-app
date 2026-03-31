import api from '@/lib/api'

interface OvertimeListItem {
  id: number
  memberId: number
  memberName: string
  totalAmount: number
  allowanceYearMonth: string
}

interface OvertimeListResponse {
  content: OvertimeListItem[]
  totalElements: number
}

interface OvertimeDetailResponse {
  id: number
  totalAmount: number
}

// 연장근무 수당 목록 조회
export const getOvertimeStatements = async (params: {
  allowanceYearMonth?: string
  headOfficeId?: number
  franchiseStoreId?: number
}): Promise<OvertimeListResponse> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null),
  )
  const response = await api.get<{ data: OvertimeListResponse }>(
    '/api/employee/payroll/overtime',
    { params: cleanParams },
  )
  return response.data.data ?? { content: [], totalElements: 0 }
}

// 연장근무 수당 상세 조회
export const getOvertimeStatement = async (id: number): Promise<OvertimeDetailResponse> => {
  const response = await api.get<{ data: OvertimeDetailResponse }>(
    `/api/employee/payroll/overtime/${id}`,
  )
  return response.data.data ?? { id: 0, totalAmount: 0 }
}
