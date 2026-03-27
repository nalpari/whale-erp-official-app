import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteTodos, createTodo, getEmployeeOptions } from '@/lib/api/todo'
import type { TodoCreateRequest } from '@/types/todo'

export const todoKeys = {
  all: ['todo'] as const,
  employees: (params: Record<string, unknown>) => [...todoKeys.all, 'employees', params] as const,
}

export function useDeleteTodos() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteTodos(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
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
