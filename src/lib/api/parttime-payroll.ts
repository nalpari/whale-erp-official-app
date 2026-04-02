import api from '@/lib/api'
import type {
  PaginatedResponse,
  PartTimerPayrollListItem,
  PartTimerPayrollDetail,
  PartTimerPayrollSearchParams,
  PartTimerPayrollCreateRequest,
  PartTimerPayrollUpdateRequest,
  DailyWorkHoursSummaryResponse,
  GetDailyWorkHoursParams,
} from '@/types/parttime-payroll'

const BASE_URL = '/api/v1/employee/payroll/parttime'

const cleanParams = (params: object) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  )
}

// 목록 조회
export const getPartTimerPayrolls = async (
  params: PartTimerPayrollSearchParams,
): Promise<PaginatedResponse<PartTimerPayrollListItem>> => {
  const response = await api.get<{ data: PaginatedResponse<PartTimerPayrollListItem> }>(BASE_URL, {
    params: cleanParams(params),
  })
  return response.data.data
}

// 상세 조회
export const getPartTimerPayroll = async (id: number): Promise<PartTimerPayrollDetail> => {
  const response = await api.get<{ data: PartTimerPayrollDetail }>(`${BASE_URL}/${id}`)
  return response.data.data
}

// 등록
export const createPartTimerPayroll = async (
  data: PartTimerPayrollCreateRequest,
): Promise<PartTimerPayrollDetail> => {
  const response = await api.post<{ data: PartTimerPayrollDetail }>(BASE_URL, data)
  return response.data.data
}

// 수정
export const updatePartTimerPayroll = async (
  id: number,
  data: PartTimerPayrollUpdateRequest,
): Promise<PartTimerPayrollDetail> => {
  const response = await api.put<{ data: PartTimerPayrollDetail }>(`${BASE_URL}/${id}`, data)
  return response.data.data
}

// 삭제
export const deletePartTimerPayroll = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`)
}

// 이메일 전송
export const sendPartTimerPayrollEmail = async (id: number): Promise<void> => {
  await api.post(`${BASE_URL}/${id}/send-email`)
}

// 엑셀 다운로드
export const downloadPartTimerPayrollExcel = async (id: number): Promise<void> => {
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
  a.download = `parttime-payroll-${id}.xlsx`
  document.body.appendChild(a)
  try {
    a.click()
  } finally {
    document.body.removeChild(a)
    setTimeout(() => window.URL.revokeObjectURL(url), 1000)
  }
}

// 일별 근무시간 조회
export const getDailyWorkHours = async (
  params: GetDailyWorkHoursParams,
): Promise<DailyWorkHoursSummaryResponse | null> => {
  const response = await api.get<{ data: DailyWorkHoursSummaryResponse }>(
    `${BASE_URL}/daily-work-hours`,
    { params: cleanParams(params) },
  )
  return response.data?.data ?? null
}
