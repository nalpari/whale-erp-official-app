import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getAttendanceList, getAttendanceDetail } from '@/lib/api/commute'
import { getEmployeeInfoCommonCode } from '@/lib/api/employee'
import type { AttendanceListParams, AttendanceDetailParams } from '@/types/commute'

export const attendanceKeys = {
  all: ['attendance'] as const,
  lists: () => [...attendanceKeys.all, 'list'] as const,
  list: (params: Omit<AttendanceListParams, 'page'>) => [...attendanceKeys.lists(), params] as const,
  details: () => [...attendanceKeys.all, 'detail'] as const,
  detail: (params: AttendanceDetailParams) => [...attendanceKeys.details(), params] as const,
  employeeClassify: (officeId: number, franchiseId?: number) =>
    [...attendanceKeys.all, 'employee-classify', officeId, franchiseId] as const,
}

export const useAttendanceInfiniteList = (
  params: Omit<AttendanceListParams, 'page'>,
  enabled = true,
) =>
  useInfiniteQuery({
    queryKey: attendanceKeys.list(params),
    queryFn: ({ pageParam }) => getAttendanceList({ ...params, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.pageNumber + 1 : undefined,
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
