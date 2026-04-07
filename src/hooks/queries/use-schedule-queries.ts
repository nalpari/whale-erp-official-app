import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getScheduleList,
  upsertSchedule,
  deleteSchedule,
  deleteWorker,
  validateScheduleExcel,
  downloadScheduleTemplate,
} from '@/lib/api/schedule'
import type { ScheduleSearchParams, ScheduleRequest } from '@/types/schedule'

export const scheduleKeys = {
  all: ['schedule'] as const,
  list: (params: ScheduleSearchParams) => [...scheduleKeys.all, 'list', params] as const,
}

// 계획표 목록 조회
export const useScheduleList = (params: ScheduleSearchParams | null, enabled = true) => {
  return useQuery({
    queryKey: params ? scheduleKeys.list(params) : scheduleKeys.all,
    queryFn: () => getScheduleList(params!),
    enabled: !!params && !!params.officeId && !!params.storeId && !!params.from && !!params.to && enabled,
  })
}

// 계획표 Upsert (생성/수정)
export const useUpsertSchedule = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ storeId, data, replaceMode }: {
      storeId: number
      data: ScheduleRequest[]
      replaceMode?: boolean
    }) => upsertSchedule(storeId, data, replaceMode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all })
    },
  })
}

// 일자 삭제
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ storeId, date }: { storeId: number; date: string }) =>
      deleteSchedule(storeId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all })
    },
  })
}

// 근무자 삭제
export const useDeleteWorker = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ storeId, date, memberId, tempWorkerName }: {
      storeId: number
      date: string
      memberId?: number
      tempWorkerName?: string
    }) => deleteWorker(storeId, date, memberId, tempWorkerName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all })
    },
  })
}

// 엑셀 파일 검증
export const useValidateScheduleExcel = () => {
  return useMutation({
    mutationFn: ({ storeId, file }: { storeId: number; file: File }) =>
      validateScheduleExcel(storeId, file),
  })
}

// 엑셀 샘플 템플릿 다운로드
export const useDownloadScheduleTemplate = () => {
  return useMutation({
    mutationFn: () => downloadScheduleTemplate(),
  })
}
