import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteTodos, createTodo, getEmployeeOptions, getCalendarData } from '@/lib/api/todo'
import type { TodoCreateRequest } from '@/types/todo'

export const todoKeys = {
  all: ['todo'] as const,
  calendar: (params: { year: number; month: number; headOfficeId: number | null; storeId: number | null }) =>
    [...todoKeys.all, 'calendar', params] as const,
  employeesAll: [...['todo'], 'employees'] as const,
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
    queryFn: () => {
      if (!headOfficeId) throw new Error('headOfficeId가 없습니다.')
      return getCalendarData({
        year,
        month,
        headOfficeId,
        ...(storeId ? { storeId } : {}),
      })
    },
    enabled: !!headOfficeId,
  })
}

// 할 일 삭제 (mutateAsync + try/catch 전용 — mutate() 단독 사용 금지)
export function useDeleteTodos() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteTodos(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
    },
  })
}

// 할 일 등록 (mutateAsync + try/catch 전용 — mutate() 단독 사용 금지)
export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TodoCreateRequest) => createTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
    },
  })
}

export function useEmployeeOptions(params: {
  purpose: 'BROAD' | 'STRICT'
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
