import { useQuery } from '@tanstack/react-query'
import { getAttendanceList, getAttendanceDetail } from '@/lib/api/commute'
import { getEmployeeInfoCommonCode } from '@/lib/api/employee'
import type { AttendanceListParams, AttendanceDetailParams } from '@/types/commute'

export const attendanceKeys = {
  all: ['attendance'] as const,
  lists: () => [...attendanceKeys.all, 'list'] as const,
  list: (params: AttendanceListParams) => [...attendanceKeys.lists(), params] as const,
  details: () => [...attendanceKeys.all, 'detail'] as const,
  detail: (params: AttendanceDetailParams) => [...attendanceKeys.details(), params] as const,
  employeeClassify: (officeId: number, franchiseId?: number) =>
    [...attendanceKeys.all, 'employee-classify', officeId, franchiseId] as const,
}

export const useAttendanceList = (params: AttendanceListParams, enabled = true) =>
  useQuery({
    queryKey: attendanceKeys.list(params),
    queryFn: () => getAttendanceList(params),
    enabled: enabled && !!params.officeId,
  })

export const useAttendanceDetail = (params: AttendanceDetailParams, enabled = true) =>
  useQuery({
    queryKey: attendanceKeys.detail(params),
    queryFn: () => getAttendanceDetail(params),
    enabled: enabled && !!params.officeId && !!params.employeeId,
  })

export const useEmployeeClassifyOptions = (officeId?: number, franchiseId?: number) =>
  useQuery({
    queryKey: attendanceKeys.employeeClassify(officeId ?? 0, franchiseId),
    queryFn: () => getEmployeeInfoCommonCode(officeId ?? 0, franchiseId),
    enabled: !!officeId,
    staleTime: 10 * 60 * 1000,
  })
