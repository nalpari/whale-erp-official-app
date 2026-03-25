import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPayrollStatements,
  getPayrollStatement,
  createPayrollStatement,
  updatePayrollStatement,
  deletePayrollStatement,
  sendPayrollEmail,
  getLatestPayroll,
} from '@/lib/api/payroll'
import type {
  PayrollSearchParams,
  PayrollStatementCreateRequest,
  PayrollStatementUpdateRequest,
} from '@/types/payroll'

// Query Keys
export const payrollKeys = {
  all: ['payroll'] as const,
  lists: () => [...payrollKeys.all, 'list'] as const,
  list: (params: PayrollSearchParams) => [...payrollKeys.lists(), params] as const,
  details: () => [...payrollKeys.all, 'detail'] as const,
  detail: (id: number) => [...payrollKeys.details(), id] as const,
  latest: (employeeInfoId: number) => [...payrollKeys.all, 'latest', employeeInfoId] as const,
}

// 목록 조회
export const usePayrollList = (params: PayrollSearchParams, enabled = true) => {
  return useQuery({
    queryKey: payrollKeys.list(params),
    queryFn: () => getPayrollStatements(params),
    enabled,
  })
}

// 상세 조회
export const usePayrollDetail = (id?: number) => {
  return useQuery({
    queryKey: payrollKeys.detail(id!),
    queryFn: () => getPayrollStatement(id!),
    enabled: !!id,
  })
}

// 이전 급여 조회
export const useLatestPayroll = (employeeInfoId?: number) => {
  return useQuery({
    queryKey: payrollKeys.latest(employeeInfoId!),
    queryFn: () => getLatestPayroll(employeeInfoId!),
    enabled: !!employeeInfoId,
  })
}

// 생성
export const useCreatePayroll = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data, file }: { data: PayrollStatementCreateRequest; file?: File }) =>
      createPayrollStatement(data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.lists() })
    },
  })
}

// 수정
export const useUpdatePayroll = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PayrollStatementUpdateRequest }) =>
      updatePayrollStatement(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.lists() })
      queryClient.invalidateQueries({ queryKey: payrollKeys.detail(variables.id) })
    },
  })
}

// 삭제
export const useDeletePayroll = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePayrollStatement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.lists() })
    },
  })
}

// 이메일 전송
export const useSendPayrollEmail = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => sendPayrollEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.lists() })
    },
  })
}
