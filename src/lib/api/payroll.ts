import api from '@/lib/api'
import type {
  PaginatedResponse,
  PayrollStatementListItem,
  PayrollStatementDetail,
  PayrollSearchParams,
  PayrollStatementCreateRequest,
  PayrollStatementUpdateRequest,
} from '@/types/payroll'

const BASE_URL = '/api/v1/employee/payroll/regular'

// undefined/null/빈 문자열 제거 (API에서 null을 long으로 변환 시 에러 방지)
const cleanParams = (params: object) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  )
}

// 목록 조회
export const getPayrollStatements = async (
  params: PayrollSearchParams,
): Promise<PaginatedResponse<PayrollStatementListItem>> => {
  const response = await api.get<{ data: PaginatedResponse<PayrollStatementListItem> }>(BASE_URL, {
    params: cleanParams(params),
  })
  return response.data.data
}

// 상세 조회
export const getPayrollStatement = async (id: number): Promise<PayrollStatementDetail> => {
  const response = await api.get<{ data: PayrollStatementDetail }>(`${BASE_URL}/${id}`)
  return response.data.data
}

// 신규 등록 (FormData - 파일 첨부 지원)
export const createPayrollStatement = async (data: PayrollStatementCreateRequest, file?: File): Promise<PayrollStatementDetail> => {
  const formData = new FormData()
  formData.append('employmentContractId', String(data.employmentContractId))
  formData.append('payrollYearMonth', data.payrollYearMonth)
  formData.append('settlementStartDate', data.settlementStartDate)
  formData.append('settlementEndDate', data.settlementEndDate)
  formData.append('paymentDate', data.paymentDate)
  if (data.remarks) formData.append('remarks', data.remarks)

  data.paymentItems.forEach((item, i) => {
    formData.append(`paymentItems[${i}].itemCode`, item.itemCode)
    formData.append(`paymentItems[${i}].itemOrder`, String(item.itemOrder))
    formData.append(`paymentItems[${i}].amount`, String(item.amount))
    if (item.remarks) formData.append(`paymentItems[${i}].remarks`, item.remarks)
  })

  data.deductionItems.forEach((item, i) => {
    formData.append(`deductionItems[${i}].itemCode`, item.itemCode)
    formData.append(`deductionItems[${i}].itemOrder`, String(item.itemOrder))
    formData.append(`deductionItems[${i}].amount`, String(item.amount))
    if (item.remarks) formData.append(`deductionItems[${i}].remarks`, item.remarks)
  })

  if (file) formData.append('attachmentFile', file)

  const response = await api.post<{ data: PayrollStatementDetail }>(BASE_URL, formData)
  return response.data.data
}

// 수정
export const updatePayrollStatement = async (
  id: number,
  data: PayrollStatementUpdateRequest,
): Promise<PayrollStatementDetail> => {
  const response = await api.put<{ data: PayrollStatementDetail }>(`${BASE_URL}/${id}`, data)
  return response.data.data
}

// 삭제
export const deletePayrollStatement = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`)
}

// 이메일 전송
export const sendPayrollEmail = async (id: number): Promise<void> => {
  await api.post(`${BASE_URL}/${id}/email`)
}

// 이전 급여 조회
export const getLatestPayroll = async (employeeInfoId: number): Promise<PayrollStatementDetail> => {
  const response = await api.get<{ data: PayrollStatementDetail }>(`${BASE_URL}/latest/${employeeInfoId}`)
  return response.data.data
}
