import api from '@/lib/api'
import type { EmployeeClassifyOption, EmployeeSimpleListItem, GetEmployeeListByTypeParams } from '@/types/employee'
import type {
  PostEmployeeInfoRequest,
  EmployeeInfoResponse,
  EmployeeInfoDetailResponse,
  EmployeeSearchParams,
  EmployeeListItem,
  UpdateEmployeeInfoRequest,
  EmployeeFiles,
  EmployeeCareerResponse,
  SaveEmployeeCareersRequest,
  EmployeeCertificateResponse,
  SaveEmployeeCertificatesRequest,
  MemberDocument,
  UpdateEmployeeLoginInfoRequest,
  MinimumWageInfo,
  CheckEmployeeNumberResult,
  EmployeeSimpleListResponse,
  GetEmployeeListByTypeParams,
  EmployeeInfoCommonCodeResponse,
} from '@/types/employee'
import type { PaginatedResponse } from '@/types/payroll'

const BASE_URL = '/api/v1/employee/info'

// undefined/null/빈 문자열 제거 (API에서 null을 long으로 변환 시 에러 방지)
const cleanParams = (params: object) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  )
}

// ========== 직원 CRUD ==========

// 백엔드 API 응답 타입 (필드명 변환 전)
interface EmployeeInfoListApiResponse {
  employeeInfoId: number
  rowNumber: number
  workStatus: string | null
  workStatusName: string | null
  headOfficeOrganizationName: string
  franchiseOrganizationName: string | null
  storeName: string | null
  employeeName: string
  employeeClassification: string | null
  employeeClassificationName: string | null
  contractClassification: string | null
  contractClassificationName: string | null
  hireDate: string
  memberId: number | null
  isEmailSend: boolean | null
  memberStatus: string
  healthCheckExpiryDate: string | null
  memo: string | null
}

interface EmployeeListApiResponse {
  content: EmployeeInfoListApiResponse[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

// 직원 목록 조회
export async function getEmployeeList(
  params: EmployeeSearchParams,
): Promise<PaginatedResponse<EmployeeListItem>> {
  const response = await api.get<{ data: EmployeeListApiResponse }>(BASE_URL, {
    params: cleanParams(params),
  })
  const apiData = response.data.data

  return {
    content: apiData.content.map((item) => ({
      employeeInfoId: item.employeeInfoId,
      rowNumber: item.rowNumber,
      workStatus: item.workStatus,
      workStatusName: item.workStatusName,
      memberId: item.memberId,
      isEmailSend: item.isEmailSend,
      memberStatus: item.memberStatus,
      headOfficeName: item.headOfficeOrganizationName,
      franchiseName: item.franchiseOrganizationName,
      storeName: item.storeName,
      employeeName: item.employeeName,
      employeeClassification: item.employeeClassification,
      employeeClassificationName: item.employeeClassificationName,
      contractClassification: item.contractClassification,
      contractClassificationName: item.contractClassificationName,
      hireDate: item.hireDate,
      healthCheckExpiryDate: item.healthCheckExpiryDate ?? null,
      memo: item.memo ?? null,
    })),
    totalElements: apiData.totalElements,
    totalPages: apiData.totalPages,
    size: apiData.size,
    number: apiData.number,
  }
}

// 직원 상세 조회
export async function getEmployee(id: number): Promise<EmployeeInfoDetailResponse> {
  const response = await api.get<{ data: EmployeeInfoDetailResponse }>(`${BASE_URL}/${id}`)
  return response.data.data
}

// 직원 등록
export async function createEmployee(data: PostEmployeeInfoRequest): Promise<EmployeeInfoResponse> {
  const response = await api.post<{ data: EmployeeInfoResponse }>(BASE_URL, data)
  return response.data.data
}

// 직원 정보 수정
export async function updateEmployee(
  id: number,
  data: UpdateEmployeeInfoRequest,
): Promise<EmployeeInfoResponse> {
  const response = await api.put<{ data: EmployeeInfoResponse }>(`${BASE_URL}/${id}`, data)
  return response.data.data
}

// 직원 정보 수정 (파일 포함)
export async function updateEmployeeWithFiles(
  id: number,
  data: UpdateEmployeeInfoRequest,
  files: EmployeeFiles,
): Promise<EmployeeInfoResponse> {
  const formData = new FormData()

  const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  formData.append('data', jsonBlob)

  if (files.residentRegistrationFile) {
    formData.append('residentRegistrationFile', files.residentRegistrationFile)
  }
  if (files.familyRelationFile) {
    formData.append('familyRelationFile', files.familyRelationFile)
  }
  if (files.healthCheckFile) {
    formData.append('healthCheckFile', files.healthCheckFile)
  }
  if (files.resumeFile) {
    formData.append('resumeFile', files.resumeFile)
  }

  const response = await api.put<{ data: EmployeeInfoResponse }>(
    `${BASE_URL}/${id}/with-files`,
    formData,
  )
  return response.data.data
}

// 직원 삭제 (soft delete)
export async function deleteEmployee(id: number): Promise<void> {
  await api.delete(`${BASE_URL}/${id}`)
}

// ========== 검증 / 이메일 ==========

// 사번 중복 확인
export async function checkEmployeeNumber(
  employeeNumber: string,
  headOfficeOrganizationId: number,
  franchiseOrganizationId?: number | null,
  storeId?: number | null,
): Promise<CheckEmployeeNumberResult> {
  const response = await api.get<{ data: boolean; message: string }>(
    `${BASE_URL}/check-employee-number`,
    {
      params: {
        employeeNumber,
        headOfficeOrganizationId,
        ...(franchiseOrganizationId != null && { franchiseOrganizationId }),
        ...(storeId != null && { storeId }),
      },
    },
  )
  return {
    isDuplicate: response.data.data,
    message: response.data.message || '',
  }
}

// 직원 회원 가입 요청 이메일 전송
export async function sendEmployeeRegistrationEmail(employeeId: number): Promise<void> {
  await api.post(`${BASE_URL}/${employeeId}/send-registration-email`)
}

// ========== 경력 정보 ==========

export async function getEmployeeCareers(memberId: number): Promise<EmployeeCareerResponse[]> {
  const response = await api.get<{ data: EmployeeCareerResponse[] }>(
    `/api/v1/employee/member/${memberId}/careers`,
  )
  return response.data.data
}

export async function saveEmployeeCareers(
  memberId: number,
  data: SaveEmployeeCareersRequest,
): Promise<EmployeeCareerResponse[]> {
  const response = await api.put<{ data: EmployeeCareerResponse[] }>(
    `/api/v1/employee/member/${memberId}/careers`,
    data,
  )
  return response.data.data
}

export async function deleteAllEmployeeCareers(memberId: number): Promise<void> {
  await api.delete(`/api/v1/employee/member/${memberId}/careers`)
}

// ========== 자격증 정보 ==========

export async function getEmployeeCertificates(
  memberId: number,
): Promise<EmployeeCertificateResponse[]> {
  const response = await api.get<{ data: EmployeeCertificateResponse[] }>(
    `/api/v1/employee/member/${memberId}/certificates`,
  )
  return response.data.data
}

export async function saveEmployeeCertificates(
  memberId: number,
  data: SaveEmployeeCertificatesRequest,
): Promise<EmployeeCertificateResponse[]> {
  const response = await api.put<{ data: EmployeeCertificateResponse[] }>(
    `/api/v1/employee/member/${memberId}/certificates`,
    data,
  )
  return response.data.data
}

export async function saveEmployeeCertificatesWithFiles(
  memberId: number,
  data: SaveEmployeeCertificatesRequest,
  files: File[],
): Promise<EmployeeCertificateResponse[]> {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))

  files.forEach((file) => {
    formData.append('files', file)
  })

  const response = await api.put<{ data: EmployeeCertificateResponse[] }>(
    `/api/v1/employee/member/${memberId}/certificates/with-files`,
    formData,
  )
  return response.data.data
}

export async function deleteAllEmployeeCertificates(memberId: number): Promise<void> {
  await api.delete(`/api/v1/employee/member/${memberId}/certificates`)
}

// ========== 회원 문서 ==========

export async function getMemberDocuments(memberId: number): Promise<MemberDocument[]> {
  const response = await api.get<{ data: MemberDocument[] }>(
    `/api/v1/members/${memberId}/documents`,
  )
  return response.data.data
}

export async function createMemberDocument(
  memberId: number,
  data: { documentType: string; uploadFileId: number; expiryDate?: string },
): Promise<MemberDocument> {
  const response = await api.post<{ data: MemberDocument }>(
    `/api/v1/members/${memberId}/documents`,
    data,
  )
  return response.data.data
}

export async function deleteMemberDocument(
  memberId: number,
  documentId: number,
): Promise<void> {
  await api.delete(`/api/v1/members/${memberId}/documents/${documentId}`)
}

// ========== 로그인 / 권한 ==========

export async function updateEmployeeLoginInfo(
  employeeInfoId: number,
  request: UpdateEmployeeLoginInfoRequest,
): Promise<void> {
  await api.patch(`${BASE_URL}/${employeeInfoId}/login-info`, request)
}

export async function withdrawEmployeeMember(employeeInfoId: number): Promise<void> {
  await api.post(`${BASE_URL}/${employeeInfoId}/withdraw`)
}

// ========== 최저시급 ==========

export async function getMinimumWage(year: number): Promise<number> {
  const response = await api.get<{ data: { minimumWage: number } }>(
    `/api/v1/employee/contract/minimum-wage/${year}`,
  )
  return response.data.data.minimumWage
}

export async function getMinimumWageList(): Promise<MinimumWageInfo[]> {
  const currentYear = new Date().getFullYear()
  const nextYear = currentYear + 1
  const result: MinimumWageInfo[] = []
  let lastError: unknown

  try {
    const currentWage = await getMinimumWage(currentYear)
    result.push({ year: currentYear, minimumWage: currentWage })
  } catch (err) {
    console.error('[getMinimumWageList] 현재년도 최저시급 조회 실패:', err)
    lastError = err
  }

  try {
    const nextWage = await getMinimumWage(nextYear)
    result.push({ year: nextYear, minimumWage: nextWage })
  } catch (err) {
    console.error('[getMinimumWageList] 다음년도 최저시급 조회 실패:', err)
    lastError = err
  }

  if (result.length === 0 && lastError) {
    throw lastError
  }

  return result
}

// ========== 공통코드 ==========

export async function getEmployeeCommonCode(
  headOfficeId?: number,
  franchiseId?: number,
): Promise<EmployeeInfoCommonCodeResponse | null> {
  try {
    const params: Record<string, number> = {}
    if (headOfficeId != null) params.headOfficeId = headOfficeId
    if (franchiseId != null) params.franchiseId = franchiseId

    const response = await api.get<{ data: EmployeeInfoCommonCodeResponse | null }>(
      `${BASE_URL}/common-code`,
      { params },
    )
    return response.data.data
  } catch (err) {
    console.error('[getEmployeeCommonCode] 공통코드 조회 실패:', err)
    throw err
  }
}

// ========== 직원 타입별 목록 ==========

export async function getEmployeeListByType(
  params: GetEmployeeListByTypeParams,
): Promise<EmployeeSimpleListResponse[]> {
  const queryParams: Record<string, string | number> = {
    headOfficeId: params.headOfficeId,
    employeeType: params.employeeType,
  }
  if (params.franchiseId != null) {
    queryParams.franchiseId = params.franchiseId
  }

  const response = await api.get<{ data: EmployeeSimpleListResponse[] }>(
    `${BASE_URL}/by-type`,
    { params: queryParams },
  )
  return response.data.data
}

// 직원 분류 공통코드 조회
export const getEmployeeInfoCommonCode = async (
  headOfficeId: number,
  franchiseId?: number,
): Promise<EmployeeClassifyOption[]> => {
  const params: Record<string, number> = { headOfficeId }
  if (franchiseId) params.franchiseId = franchiseId
  const response = await api.get<{
    data: { codeMemoContent: { EMPLOYEE?: EmployeeClassifyOption[] } | null } | null
  }>('/api/v1/employee/info/common-code', { params })
  return response.data.data?.codeMemoContent?.EMPLOYEE ?? []
}
