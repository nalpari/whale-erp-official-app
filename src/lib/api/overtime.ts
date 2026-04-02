import api from '@/lib/api'
import type {
  PaginatedResponse,
  OvertimeAllowanceListItem,
  OvertimeAllowanceDetail,
  OvertimeSearchParams,
  OvertimeAllowanceCreateRequest,
  OvertimeAllowanceUpdateRequest,
  DailyOvertimeHoursSummaryResponse,
  GetDailyOvertimeHoursParams,
} from '@/types/overtime'

const BASE_URL = '/api/v1/employee/payroll/overtime'

const cleanParams = (params: object) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  )
}

// 목록 조회
export const getOvertimeStatements = async (
  params: OvertimeSearchParams,
): Promise<PaginatedResponse<OvertimeAllowanceListItem>> => {
  const response = await api.get<{ data: PaginatedResponse<OvertimeAllowanceListItem> }>(
    BASE_URL,
    { params: cleanParams(params) },
  )
  return response.data.data
}

// 상세 조회
export const getOvertimeStatement = async (id: number): Promise<OvertimeAllowanceDetail> => {
  const response = await api.get<{ data: OvertimeAllowanceDetail }>(`${BASE_URL}/${id}`)
  return response.data.data
}

// 등록
export const createOvertimeStatement = async (
  data: OvertimeAllowanceCreateRequest,
): Promise<OvertimeAllowanceDetail> => {
  const response = await api.post<{ data: OvertimeAllowanceDetail }>(BASE_URL, data)
  return response.data.data
}

// 수정
export const updateOvertimeStatement = async (
  id: number,
  data: OvertimeAllowanceUpdateRequest,
): Promise<OvertimeAllowanceDetail> => {
  const response = await api.put<{ data: OvertimeAllowanceDetail }>(`${BASE_URL}/${id}`, data)
  return response.data.data
}

// 삭제
export const deleteOvertimeStatement = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`)
}

// 이메일 전송
export const sendOvertimeStatementEmail = async (id: number): Promise<void> => {
  await api.post(`${BASE_URL}/${id}/send-email`)
}

// 엑셀 다운로드
export const downloadOvertimeStatementExcel = async (id: number): Promise<void> => {
  const response = await api.get(`${BASE_URL}/${id}/download-excel`, {
    responseType: 'blob',
  })
  const contentType = response.headers['content-type'] ?? ''
  if (!contentType.includes('spreadsheet') && !contentType.includes('octet-stream')) {
    throw new Error('엑셀 파일이 아닌 응답입니다.')
  }
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `overtime-allowance-${id}.xlsx`
  document.body.appendChild(a)
  try {
    a.click()
  } finally {
    document.body.removeChild(a)
    setTimeout(() => window.URL.revokeObjectURL(url), 1000)
  }
}

// 일별 연장근무 시간 조회
export const getDailyOvertimeHours = async (
  params: GetDailyOvertimeHoursParams,
): Promise<DailyOvertimeHoursSummaryResponse | null> => {
  const response = await api.get<{ data: DailyOvertimeHoursSummaryResponse }>(
    `${BASE_URL}/daily-overtime-hours`,
    { params: cleanParams(params) },
  )
  return response.data?.data ?? null
}
