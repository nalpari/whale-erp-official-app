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

const BASE_URL = '/api/v1/employee/contract'

// undefined/null/빈 문자열 제거
const cleanParams = (params: object) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  )
}

// 목록 조회 — 백엔드가 PageResponse를 직접 반환 (ApiResponse 래핑 없음)
export const getContracts = async (
  params: ContractSearchParams,
): Promise<PaginatedResponse<ContractListItem>> => {
  const response = await api.get<PaginatedResponse<ContractListItem>>(BASE_URL, {
    params: cleanParams(params),
  })
  return response.data
}

// 직원별 계약 목록 조회
export const getContractsByEmployee = async (employeeInfoId: number): Promise<ContractDetail[]> => {
  const response = await api.get<{ data: ContractDetail[] }>(`${BASE_URL}/by-employee-info/${employeeInfoId}`)
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

// 계약서 문서 다운로드 (DOCX)
export const downloadContractDocx = async (contractId: number): Promise<void> => {
  const response = await api.get<Blob>(`${BASE_URL}/${contractId}/download-docx`, {
    responseType: 'blob',
  })

  // 서버 에러 응답이 blob으로 온 경우 (JSON 에러를 파일로 저장 방지)
  const contentType = response.headers['content-type'] ?? ''
  if (contentType.includes('application/json')) {
    const text = await response.data.text()
    try {
      const err = JSON.parse(text)
      throw new Error(err.message ?? '계약서 다운로드에 실패했습니다.')
    } catch (e) {
      if (e instanceof Error) throw e
      throw new Error('계약서 다운로드에 실패했습니다.')
    }
  }

  const disposition = response.headers['content-disposition'] ?? ''
  const filenameMatch = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';\n]+)/)
  let filename = `근로계약서_${contractId}.docx`
  if (filenameMatch) {
    try {
      filename = decodeURIComponent(filenameMatch[1]).replace(/[/\\:*?"<>|]/g, '_')
    } catch {
      // decodeURIComponent 실패 시 기본 파일명 사용
    }
  }

  const url = URL.createObjectURL(response.data)
  try {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}

// 최저임금 조회
export const getMinimumWage = async (year: number): Promise<MinimumWageResponse> => {
  const response = await api.get<{ data: MinimumWageResponse }>(`${BASE_URL}/minimum-wage/${year}`)
  return response.data.data
}
