import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPartTimerPayrolls,
  getPartTimerPayroll,
  createPartTimerPayroll,
  updatePartTimerPayroll,
  deletePartTimerPayroll,
  sendPartTimerPayrollEmail,
  downloadPartTimerPayrollExcel,
} from '@/lib/api/parttime-payroll'
import type {
  PartTimerPayrollSearchParams,
  PartTimerPayrollCreateRequest,
  PartTimerPayrollUpdateRequest,
} from '@/types/parttime-payroll'

export const partTimerPayrollKeys = {
  all: ['parttime-payroll'] as const,
  lists: () => [...partTimerPayrollKeys.all, 'list'] as const,
  list: (params: PartTimerPayrollSearchParams) => [...partTimerPayrollKeys.lists(), params] as const,
  details: () => [...partTimerPayrollKeys.all, 'detail'] as const,
  detail: (id: number) => [...partTimerPayrollKeys.details(), id] as const,
}

// 목록 조회
export const usePartTimerPayrollList = (params: PartTimerPayrollSearchParams, enabled = true) => {
  return useQuery({
    queryKey: partTimerPayrollKeys.list(params),
    queryFn: () => getPartTimerPayrolls(params),
    enabled,
  })
}

// 상세 조회
export const usePartTimerPayrollDetail = (id?: number) => {
  return useQuery({
    queryKey: partTimerPayrollKeys.detail(id ?? 0),
    queryFn: () => getPartTimerPayroll(id ?? 0),
    enabled: !!id,
  })
}

// 등록
export const useCreatePartTimerPayroll = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PartTimerPayrollCreateRequest) => createPartTimerPayroll(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partTimerPayrollKeys.all })
    },
  })
}

// 수정
export const useUpdatePartTimerPayroll = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PartTimerPayrollUpdateRequest }) =>
      updatePartTimerPayroll(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partTimerPayrollKeys.all })
    },
  })
}

// 삭제
export const useDeletePartTimerPayroll = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePartTimerPayroll(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partTimerPayrollKeys.all })
    },
  })
}

// 이메일 전송
export const useSendPartTimerPayrollEmail = () => {
  return useMutation({
    mutationFn: (id: number) => sendPartTimerPayrollEmail(id),
  })
}

// 엑셀 다운로드
export const useDownloadPartTimerPayrollExcel = () => {
  return useMutation({
    mutationFn: (id: number) => downloadPartTimerPayrollExcel(id),
  })
}
