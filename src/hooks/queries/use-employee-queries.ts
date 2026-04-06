import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getEmployeeList,
  getEmployee,
  createEmployee,
  updateEmployee,
  updateEmployeeWithFiles,
  deleteEmployee,
  checkEmployeeNumber,
  sendEmployeeRegistrationEmail,
  getEmployeeCareers,
  saveEmployeeCareers,
  deleteAllEmployeeCareers,
  getEmployeeCertificates,
  saveEmployeeCertificates,
  saveEmployeeCertificatesWithFiles,
  deleteAllEmployeeCertificates,
  getMemberDocuments,
  createMemberDocument,
  deleteMemberDocument,
  updateEmployeeLoginInfo,
  withdrawEmployeeMember,
  getEmployeeCommonCode,
  getEmployeeListByType,
} from '@/lib/api/employee'
import type {
  EmployeeSearchParams,
  PostEmployeeInfoRequest,
  UpdateEmployeeInfoRequest,
  EmployeeFiles,
  SaveEmployeeCareersRequest,
  SaveEmployeeCertificatesRequest,
  UpdateEmployeeLoginInfoRequest,
  GetEmployeeListByTypeParams,
} from '@/types/employee'

// ========== Query Keys ==========

export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (params: EmployeeSearchParams) => [...employeeKeys.lists(), params] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
  careers: (memberId: number) => [...employeeKeys.all, 'career', memberId] as const,
  certificates: (memberId: number) => [...employeeKeys.all, 'certificate', memberId] as const,
  documents: (memberId: number) => [...employeeKeys.all, 'document', memberId] as const,
  byType: (params: GetEmployeeListByTypeParams) => [...employeeKeys.all, 'by-type', params] as const,
  commonCode: (headOfficeId?: number, franchiseId?: number) =>
    [...employeeKeys.all, 'common-code', { headOfficeId, franchiseId }] as const,
}

// ========== Query 훅 ==========

// 직원 목록 조회
export const useEmployeeList = (params: EmployeeSearchParams, enabled = true) => {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => getEmployeeList(params),
    enabled,
    staleTime: 30 * 1000,
  })
}

// 직원 상세 조회
export const useEmployeeDetail = (id?: number | null) => {
  return useQuery({
    queryKey: employeeKeys.detail(id ?? 0),
    queryFn: () => getEmployee(id ?? 0),
    enabled: !!id,
  })
}

// 경력 정보 조회
export const useEmployeeCareers = (memberId?: number | null, enabled = true) => {
  return useQuery({
    queryKey: employeeKeys.careers(memberId ?? 0),
    queryFn: () => getEmployeeCareers(memberId ?? 0),
    enabled: !!memberId && enabled,
  })
}

// 자격증 정보 조회
export const useEmployeeCertificates = (memberId?: number | null, enabled = true) => {
  return useQuery({
    queryKey: employeeKeys.certificates(memberId ?? 0),
    queryFn: () => getEmployeeCertificates(memberId ?? 0),
    enabled: !!memberId && enabled,
  })
}

// 회원 문서 조회
export const useMemberDocuments = (memberId?: number | null, enabled = true) => {
  return useQuery({
    queryKey: employeeKeys.documents(memberId ?? 0),
    queryFn: () => getMemberDocuments(memberId ?? 0),
    enabled: !!memberId && enabled,
  })
}

// 공통코드 조회 (직원분류, 직급, 직책)
export const useEmployeeCommonCode = (
  headOfficeId?: number,
  franchiseId?: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: employeeKeys.commonCode(headOfficeId, franchiseId),
    queryFn: () => getEmployeeCommonCode(headOfficeId, franchiseId),
    enabled: enabled && !!headOfficeId,
  })
}

// 직원 타입별 목록 조회
export const useEmployeeListByType = (
  params: GetEmployeeListByTypeParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: employeeKeys.byType(params),
    queryFn: () => getEmployeeListByType(params),
    enabled,
  })
}

// ========== Mutation 훅 ==========

// 직원 생성
export const useCreateEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PostEmployeeInfoRequest) => createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
  })
}

// 직원 수정
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEmployeeInfoRequest }) =>
      updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
  })
}

// 직원 수정 (파일 포함)
export const useUpdateEmployeeWithFiles = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
      files,
    }: {
      id: number
      data: UpdateEmployeeInfoRequest
      files: EmployeeFiles
    }) => updateEmployeeWithFiles(id, data, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
  })
}

// 직원 삭제
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
  })
}

// 사번 중복 확인
export const useCheckEmployeeNumber = () => {
  return useMutation({
    mutationFn: ({
      employeeNumber,
      headOfficeOrganizationId,
      franchiseOrganizationId,
      storeId,
    }: {
      employeeNumber: string
      headOfficeOrganizationId: number
      franchiseOrganizationId?: number | null
      storeId?: number | null
    }) => checkEmployeeNumber(employeeNumber, headOfficeOrganizationId, franchiseOrganizationId, storeId),
  })
}

// 가입 요청 이메일 전송
export const useSendRegistrationEmail = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (employeeId: number) => sendEmployeeRegistrationEmail(employeeId),
    onSuccess: (_, employeeId) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(employeeId) })
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
    },
  })
}

// 경력 정보 저장
export const useSaveEmployeeCareers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: number
      data: SaveEmployeeCareersRequest
    }) => saveEmployeeCareers(memberId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.careers(variables.memberId) })
    },
  })
}

// 경력 정보 전체 삭제
export const useDeleteAllEmployeeCareers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (memberId: number) => deleteAllEmployeeCareers(memberId),
    onSuccess: (_, memberId) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.careers(memberId) })
    },
  })
}

// 자격증 정보 저장
export const useSaveEmployeeCertificates = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: number
      data: SaveEmployeeCertificatesRequest
    }) => saveEmployeeCertificates(memberId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.certificates(variables.memberId) })
    },
  })
}

// 자격증 정보 저장 (파일 포함)
export const useSaveEmployeeCertificatesWithFiles = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      memberId,
      data,
      files,
    }: {
      memberId: number
      data: SaveEmployeeCertificatesRequest
      files: File[]
    }) => saveEmployeeCertificatesWithFiles(memberId, data, files),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.certificates(variables.memberId) })
    },
  })
}

// 자격증 정보 전체 삭제
export const useDeleteAllEmployeeCertificates = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (memberId: number) => deleteAllEmployeeCertificates(memberId),
    onSuccess: (_, memberId) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.certificates(memberId) })
    },
  })
}

// 회원 문서 등록
export const useCreateMemberDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: number
      data: { documentType: string; uploadFileId: number; expiryDate?: string }
    }) => createMemberDocument(memberId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.documents(variables.memberId) })
    },
  })
}

// 회원 문서 삭제
export const useDeleteMemberDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      memberId,
      documentId,
    }: {
      memberId: number
      documentId: number
    }) => deleteMemberDocument(memberId, documentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.documents(variables.memberId) })
    },
  })
}

// 로그인 정보 수정
export const useUpdateEmployeeLoginInfo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      employeeInfoId,
      request,
    }: {
      employeeInfoId: number
      request: UpdateEmployeeLoginInfoRequest
    }) => updateEmployeeLoginInfo(employeeInfoId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(variables.employeeInfoId) })
    },
  })
}

// 회원 탈퇴 처리
export const useWithdrawEmployeeMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (employeeInfoId: number) => withdrawEmployeeMember(employeeInfoId),
    onSuccess: (_, employeeInfoId) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(employeeInfoId) })
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
    },
  })
}
