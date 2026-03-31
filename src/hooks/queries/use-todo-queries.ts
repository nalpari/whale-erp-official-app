import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteTodos, createTodo, getEmployeeOptions, getCalendarData } from '@/lib/api/todo'
import type { TodoCreateRequest } from '@/types/todo'

export const todoKeys = {
  all: ['todo'] as const,
  calendar: (params: { year: number; month: number; headOfficeId: number | null; storeId: number | null }) =>
    [...todoKeys.all, 'calendar', params] as const,
  employees: (params: Record<string, unknown>) => [...todoKeys.all, 'employees', params] as const,
}

export function useCalendarData(
  year: number,
  month: number,
  headOfficeId: number | null,
  storeId: number | null,
) {
  return useQuery({
    queryKey: todoKeys.calendar({ year, month, headOfficeId, storeId }),
    queryFn: () =>
      getCalendarData({
        year,
        month,
        headOfficeId: headOfficeId!,
        ...(storeId ? { storeId } : {}),
      }),
    enabled: !!headOfficeId,
  })
}

export function useDeleteTodos() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteTodos(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
    },
    onError: (err) => {
      console.error('[useDeleteTodos] 할 일 삭제 실패:', err)
    },
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TodoCreateRequest) => createTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
    },
    onError: (err) => {
      console.error('[useCreateTodo] 할 일 등록 실패:', err)
    },
  })
}

export function useEmployeeOptions(params: {
  purpose: 'SEARCH' | 'REGISTER'
  headOfficeId?: number
  franchiseId?: number
  storeId?: number
}, enabled = true) {
  return useQuery({
    queryKey: todoKeys.employees(params as Record<string, unknown>),
    queryFn: () => getEmployeeOptions(params),
    enabled,
  })
}
