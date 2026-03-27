import api from '@/lib/api'
import type { TodoCreateRequest, EmployeeOption } from '@/types/todo'

const BASE_URL = '/api/v1/employee-todos'

// 할 일 다중 삭제
export const deleteTodos = async (ids: number[]): Promise<void> => {
  await api.delete(BASE_URL, { data: ids })
}

// 할 일 등록
export const createTodo = async (data: TodoCreateRequest): Promise<{ id: number }> => {
  const response = await api.post<{ data: { id: number } }>(BASE_URL, data)
  return response.data.data
}

// 직원 Selectbox 조회
export const getEmployeeOptions = async (params: {
  purpose: 'SEARCH' | 'REGISTER'
  headOfficeId?: number
  franchiseId?: number
  storeId?: number
}): Promise<EmployeeOption[]> => {
  const response = await api.get<{ data: EmployeeOption[] }>(`${BASE_URL}/employees`, { params })
  return response.data.data
}
