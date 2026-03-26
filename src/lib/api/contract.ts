import api from '@/lib/api'
import type {
  PaginatedResponse,
  ContractListItem,
  ContractDetail,
  ContractSearchParams,
  ContractHeaderCreateRequest,
  ContractHeaderUpdateRequest,
  ContractWorkHoursRequest,
  ContractSalaryInfoCreateRequest,
  ContractSalaryInfoUpdateRequest,
  MinimumWageResponse,
} from '@/types/contract'

const BASE_URL = '/api/employee/contract'

// undefined/null/빈 문자열 제거
const cleanParams = (params: object) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  )
}

// 목록 조회
export const getContracts = async (
  params: ContractSearchParams,
): Promise<PaginatedResponse<ContractListItem>> => {
  const response = await api.get<{ data: PaginatedResponse<ContractListItem> }>(BASE_URL, {
    params: cleanParams(params),
  })
  return response.data.data
}

// 상세 조회
export const getContract = async (id: number): Promise<ContractDetail> => {
  const response = await api.get<{ data: ContractDetail }>(`${BASE_URL}/${id}`)
  return response.data.data
}

// Step 1: 헤더 등록 (FormData — 파일 첨부)
export const createContractHeader = async (
  data: ContractHeaderCreateRequest,
  workContractFile?: File,
  wageContractFile?: File,
): Promise<number> => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  })
  if (workContractFile) formData.append('workContractFile', workContractFile)
  if (wageContractFile) formData.append('wageContractFile', wageContractFile)

  const response = await api.post<{ data: number }>(
    `${BASE_URL}/header`,
    formData,
  )
  return response.data.data
}

// Step 2: 근무시간 등록
export const createContractWorkHours = async (
  data: ContractWorkHoursRequest,
): Promise<void> => {
  await api.post(`${BASE_URL}/work-hours`, data)
}

// Step 3: 급여정보 등록
export const createContractSalaryInfo = async (
  data: ContractSalaryInfoCreateRequest,
): Promise<void> => {
  await api.post(`${BASE_URL}/salary-info`, data)
}

// 헤더 수정 (FormData)
export const updateContractHeader = async (
  id: number,
  data: ContractHeaderUpdateRequest,
  workContractFile?: File,
  wageContractFile?: File,
): Promise<ContractDetail> => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  })
  if (workContractFile) formData.append('workContractFile', workContractFile)
  if (wageContractFile) formData.append('wageContractFile', wageContractFile)

  const response = await api.put<{ data: ContractDetail }>(
    `${BASE_URL}/header/${id}`,
    formData,
  )
  return response.data.data
}

// 근무시간 수정
export const updateContractWorkHours = async (
  contractId: number,
  data: ContractWorkHoursRequest,
): Promise<void> => {
  await api.put(`${BASE_URL}/work-hours/${contractId}`, data)
}

// 급여정보 수정
export const updateContractSalaryInfo = async (
  id: number,
  data: ContractSalaryInfoUpdateRequest,
): Promise<void> => {
  await api.put(`${BASE_URL}/salary-info/${id}`, data)
}

// 삭제 (논리 삭제)
export const deleteContract = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`)
}

// 이메일 전송
export const sendContractEmail = async (id: number): Promise<void> => {
  await api.post(`${BASE_URL}/${id}/send-email`)
}

// 최저임금 조회
export const getMinimumWage = async (year: number): Promise<MinimumWageResponse> => {
  const response = await api.get<{ data: MinimumWageResponse }>(`${BASE_URL}/minimum-wage/${year}`)
  return response.data.data
}
