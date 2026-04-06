import api from '@/lib/api'
import type {
  AttendanceListParams,
  AttendanceListResponse,
  AttendanceDetailParams,
  AttendanceDetailResponse,
} from '@/types/commute'

function cleanParams(params: object): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => {
      if (v === undefined || v === null || v === '') return false
      if (Array.isArray(v) && v.length === 0) return false
      return true
    }),
  )
}

function buildParamsSerializer(params: Record<string, unknown>): string {
  const sp = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const item of value) sp.append(key, String(item))
    } else {
      sp.append(key, String(value))
    }
  }
  return sp.toString()
}

export const getAttendanceList = async (params: AttendanceListParams): Promise<AttendanceListResponse> => {
  const cleaned = cleanParams(params)
  const response = await api.get<{ data: AttendanceListResponse }>('/api/v1/employee/attendances', {
    params: cleaned,
    paramsSerializer: () => buildParamsSerializer(cleaned),
  })
  const result = response.data.data
  if (!result) throw new Error('[getAttendanceList] 서버 응답에 data 필드가 없습니다.')
  return result
}

export const getAttendanceDetail = async (params: AttendanceDetailParams): Promise<AttendanceDetailResponse> => {
  const cleaned = cleanParams(params)
  const response = await api.get<{ data: AttendanceDetailResponse }>('/api/v1/employee/attendances/records', {
    params: cleaned,
    paramsSerializer: () => buildParamsSerializer(cleaned),
  })
  const result = response.data.data
  if (!result) throw new Error('[getAttendanceDetail] 서버 응답에 data 필드가 없습니다.')
  return result
}
