import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOvertimeStatements,
  getOvertimeStatement,
  createOvertimeStatement,
  updateOvertimeStatement,
  deleteOvertimeStatement,
  sendOvertimeStatementEmail,
  downloadOvertimeStatementExcel,
} from '@/lib/api/overtime'
import type {
  OvertimeSearchParams,
  OvertimeAllowanceCreateRequest,
  OvertimeAllowanceUpdateRequest,
} from '@/types/overtime'

export const overtimeKeys = {
  all: ['overtime'] as const,
  lists: () => [...overtimeKeys.all, 'list'] as const,
  list: (params: OvertimeSearchParams) => [...overtimeKeys.lists(), params] as const,
  details: () => [...overtimeKeys.all, 'detail'] as const,
  detail: (id: number) => [...overtimeKeys.details(), id] as const,
}

// 목록 조회
export const useOvertimeList = (params: OvertimeSearchParams, enabled = true) => {
  return useQuery({
    queryKey: overtimeKeys.list(params),
    queryFn: () => getOvertimeStatements(params),
    enabled,
  })
}

// 상세 조회
export const useOvertimeDetail = (id?: number) => {
  return useQuery({
    queryKey: overtimeKeys.detail(id ?? 0),
    queryFn: () => getOvertimeStatement(id ?? 0),
    enabled: !!id,
  })
}

// 등록
export const useCreateOvertime = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: OvertimeAllowanceCreateRequest) => createOvertimeStatement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: overtimeKeys.all })
    },
    onError: (err) => {
      console.error('[useCreateOvertime] 등록 실패:', err)
    },
  })
}

// 수정
export const useUpdateOvertime = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: OvertimeAllowanceUpdateRequest }) =>
      updateOvertimeStatement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: overtimeKeys.all })
    },
    onError: (err) => {
      console.error('[useUpdateOvertime] 수정 실패:', err)
    },
  })
}

// 삭제
export const useDeleteOvertime = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteOvertimeStatement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: overtimeKeys.all })
    },
    onError: (err) => {
      console.error('[useDeleteOvertime] 삭제 실패:', err)
    },
  })
}

// 이메일 전송
export const useSendOvertimeEmail = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => sendOvertimeStatementEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: overtimeKeys.all })
    },
    onError: (err) => {
      console.error('[useSendOvertimeEmail] 이메일 전송 실패:', err)
    },
  })
}

// 엑셀 다운로드
export const useDownloadOvertimeExcel = () => {
  return useMutation({
    mutationFn: (id: number) => downloadOvertimeStatementExcel(id),
    onError: (err) => {
      console.error('[useDownloadOvertimeExcel] 다운로드 실패:', err)
    },
  })
}
