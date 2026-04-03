import api from '@/lib/api'
import type {
  ScheduleSearchParams,
  ScheduleResponse,
  ScheduleRequest,
  ScheduleSummary,
  ExcelValidationResponse,
} from '@/types/schedule'

const BASE_URL = '/api/v1/store-schedule'

/** undefined/null/빈 문자열 필드를 제거하여 API 쿼리 파라미터 정리 */
const cleanParams = <T extends object>(params: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ) as Partial<T>
}

// 목록 조회
export const getScheduleList = async (params: ScheduleSearchParams): Promise<ScheduleResponse[]> => {
  const response = await api.get<{ data: ScheduleResponse[] }>(BASE_URL, {
    params: cleanParams(params),
  })
  return response.data.data
}

// Upsert (생성/수정)
export const upsertSchedule = async (
  storeId: number,
  data: ScheduleRequest[],
  replaceMode?: boolean,
): Promise<ScheduleSummary[]> => {
  const response = await api.post<{ data: ScheduleSummary[] }>(
    `${BASE_URL}/${storeId}`,
    data,
    { params: replaceMode ? { replaceMode: true } : undefined },
  )
  return response.data.data
}

// 일자 삭제
export const deleteSchedule = async (storeId: number, date: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${storeId}`, { params: { date } })
}

// 근무자 삭제
export const deleteWorker = async (
  storeId: number,
  date: string,
  memberId?: number,
  tempWorkerName?: string,
): Promise<void> => {
  await api.delete(`${BASE_URL}/${storeId}/worker`, {
    params: cleanParams({ date, memberId, tempWorkerName }),
  })
}

// 엑셀 다운로드 (blob)
export const downloadScheduleExcel = async (params: {
  storeId: number
  startDate: string
  endDate: string
  employeeName?: string
  dayOfWeek?: string
}): Promise<Blob> => {
  const response = await api.get<Blob>(`${BASE_URL}/excel`, {
    params: cleanParams(params),
    responseType: 'blob',
  })
  return response.data
}

// 엑셀 템플릿 다운로드 (blob)
export const downloadScheduleTemplate = async (): Promise<Blob> => {
  const response = await api.get<Blob>(`${BASE_URL}/template`, {
    responseType: 'blob',
  })
  return response.data
}

// 엑셀 검증
export const validateScheduleExcel = async (
  storeId: number,
  file: File,
): Promise<ExcelValidationResponse> => {
  const formData = new FormData()
  formData.append('excel', file)
  const response = await api.post<{ data: ExcelValidationResponse }>(
    `${BASE_URL}/excel/${storeId}/validate`,
    formData,
  )
  return response.data.data
}
