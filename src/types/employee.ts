import type { PaginatedResponse } from '@/types/payroll'

// ========== Enum / Type ==========

// 근무처 유형
export type WorkplaceType = 'HEAD_OFFICE' | 'FRANCHISE'

// 계약 분류 유형
// CNTCFWK_001: 포괄연봉제, CNTCFWK_002: 비포괄연봉제, CNTCFWK_003: 파트타임
export type ContractClassificationType = 'CNTCFWK_001' | 'CNTCFWK_002' | 'CNTCFWK_003'

// 급여 주기
// SLRCC_001: 월급제, SLRCC_002: 시급제
export type SalaryCycle = 'SLRCC_001' | 'SLRCC_002'

// 급여 지급 월
// SLRCF_001: 당월, SLRCF_002: 익월
export type SalaryMonth = 'SLRCF_001' | 'SLRCF_002'

// 요일 유형
export type DayType =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'
  | 'WEEKDAY'
  | 'WEEKEND'

// 근무 상태
// EMPWK_001: 근무, EMPWK_002: 휴직, EMPWK_003: 퇴사
export type EmployeeWorkStatus = 'EMPWK_001' | 'EMPWK_002' | 'EMPWK_003'

// 회원 문서 타입
export type MemberDocumentType = 'RESIDENT_REGISTRATION' | 'FAMILY_RELATION' | 'HEALTH_CHECK' | 'RESUME'

// 직원 타입
export type EmployeeType = 'ALL' | 'FULL_TIME' | 'PART_TIME'

// ========== 근무 시간 DTO ==========

export interface EmploymentContractWorkHourDto {
  workHourId?: number | null
  dayType: DayType
  isWork: boolean
  isBreak: boolean
  everySaturdayWork?: boolean
  firstSaturdayWorkDay?: string | null
  everySundayWork?: boolean
  firstSundayWorkDay?: string | null
  workStartTime?: string | null // HH:mm:ss
  workEndTime?: string | null // HH:mm:ss
  breakStartTime?: string | null // HH:mm:ss
  breakEndTime?: string | null // HH:mm:ss
}

// ========== 직원 등록 요청 ==========

export interface PostEmployeeInfoRequest {
  workplaceType: WorkplaceType
  headOfficeOrganizationId: number
  franchiseOrganizationId?: number | null
  storeId?: number | null
  employeeName: string
  mobilePhone?: string | null
  hireDate: string // YYYY-MM-DD

  contractClassification: ContractClassificationType
  nationalPensionEnrolled?: boolean
  healthInsuranceEnrolled?: boolean
  employmentInsuranceEnrolled?: boolean
  workersCompensationEnrolled?: boolean
  salaryCycle: SalaryCycle
  salaryMonth: SalaryMonth
  salaryDay: number
  contractStartDate: string // YYYY-MM-DD
  contractEndDate: string // YYYY-MM-DD
  jobDescription?: string | null

  workHours: EmploymentContractWorkHourDto[]
}

// ========== 직원 상세 조회 응답 ==========

export interface EmployeeInfoDetailResponse {
  id: number
  memberId?: number | null
  memberLoginId?: string | null
  memberAuthorityNames?: string[] | null
  currentBpAuthorityId?: number | null
  memberCreatedAt?: string | null
  workplaceType: WorkplaceType
  headOfficeOrganizationId: number
  headOfficeOrganizationName?: string | null
  franchiseOrganizationId?: number | null
  franchiseOrganizationName?: string | null
  storeId?: number | null
  storeName?: string | null
  employeeName: string
  employeeNumber: string
  workStatus?: string | null
  workStatusName?: string | null
  birthDate?: string | null
  mobilePhone?: string | null
  emergencyContact?: string | null
  email?: string | null
  zipCode?: string | null
  address?: string | null
  addressDetail?: string | null
  employeeClassification?: string | null
  employeeClassificationName?: string | null
  contractClassification?: string | null
  contractClassificationName?: string | null
  rank?: string | null
  rankName?: string | null
  position?: string | null
  positionName?: string | null
  hireDate?: string | null
  resignationDate?: string | null
  resignationReason?: string | null
  salaryBank?: string | null
  salaryAccountNumber?: string | null
  salaryAccountHolder?: string | null
  memo?: string | null
  iconType?: number | null
  isEmailSend?: boolean | null
  emailSendDate?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  createdByName?: string | null
  updatedByName?: string | null
}

// ========== 직원 목록 ==========

export interface EmployeeSearchParams {
  headOfficeOrganizationId?: number
  franchiseOrganizationId?: number
  storeId?: number
  workStatus?: EmployeeWorkStatus
  employeeName?: string
  employeeClassification?: string
  contractClassification?: string
  adminAuthority?: string
  memberStatus?: string
  hireDateFrom?: string
  hireDateTo?: string
  healthCheckExpiryFrom?: string
  healthCheckExpiryTo?: string
  page: number
  size: number
}

export interface EmployeeListItem {
  employeeInfoId: number
  rowNumber: number
  workStatus: string | null
  workStatusName: string | null
  memberId?: number | null
  isEmailSend?: boolean | null
  memberStatus: string
  headOfficeName: string
  franchiseName: string | null
  storeName: string | null
  employeeName: string
  employeeClassification: string | null
  employeeClassificationName: string | null
  contractClassification: string | null
  contractClassificationName: string | null
  hireDate: string
  healthCheckExpiryDate?: string
  memo?: string
}

export type EmployeeListResponse = PaginatedResponse<EmployeeListItem>

// ========== 직원 등록 응답 ==========

export interface EmployeeInfoResponse {
  employeeId: number
  employeeName: string
  mobilePhone?: string | null
  hireDate: string
  workplaceType: WorkplaceType
}

// ========== 직원 수정 요청 ==========

export interface UpdateEmployeeInfoRequest {
  employeeNumber?: string | null
  workStatus?: string | null
  birthDate?: string | null
  mobilePhone?: string | null
  emergencyContact?: string | null
  email?: string | null
  zipCode?: string | null
  address?: string | null
  addressDetail?: string | null
  employeeClassification?: string | null
  contractClassification?: string | null
  rank?: string | null
  position?: string | null
  hireDate: string // 필수
  resignationDate?: string | null
  resignationReason?: string | null
  salaryBank?: string | null
  salaryAccountNumber?: string | null
  salaryAccountHolder?: string | null
  memo?: string | null
  iconType?: number | null
}

// ========== 파일 업로드 ==========

export interface EmployeeFiles {
  residentRegistrationFile?: File | null
  familyRelationFile?: File | null
  healthCheckFile?: File | null
  resumeFile?: File | null
}

// ========== 경력 정보 ==========

export interface EmployeeCareerResponse {
  id: number
  memberId: number
  companyName: string
  workplaceType?: string | null
  workplaceTypeName?: string | null
  startDate: string
  endDate?: string | null
  contractClassification?: string | null
  contractClassificationName?: string | null
  rank?: string | null
  rankName?: string | null
  position?: string | null
  positionName?: string | null
  jobDescription?: string | null
  resignationReason?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface EmployeeCareerItem {
  id?: number | null
  companyName: string
  workplaceType?: string | null
  startDate: string
  endDate?: string | null
  contractClassification?: string | null
  rank?: string | null
  position?: string | null
  jobDescription?: string | null
  resignationReason?: string | null
}

export interface SaveEmployeeCareersRequest {
  careers: EmployeeCareerItem[]
}

// ========== 자격증 정보 ==========

export interface EmployeeCertificateResponse {
  id: number
  memberId: number
  certificateName: string
  validityStartDate?: string | null
  validityEndDate?: string | null
  acquisitionDate: string
  issuingOrganization?: string | null
  certificateFileId?: number | null
  certificateFileName?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface EmployeeCertificateItem {
  id?: number | null
  certificateName: string
  validityStartDate?: string | null
  validityEndDate?: string | null
  acquisitionDate: string
  issuingOrganization?: string | null
  certificateFileId?: number | null
  fileIndex?: number | null
}

export interface SaveEmployeeCertificatesRequest {
  certificates: EmployeeCertificateItem[]
}

// ========== 회원 문서 ==========

export interface MemberDocument {
  id: number
  documentType: MemberDocumentType
  uploadFileId: number
  fileName: string | null
  fileSize: number | null
  expiryDate: string | null
  createdAt: string | null
}

// ========== 로그인 정보 ==========

export interface UpdateEmployeeLoginInfoRequest {
  partnerOfficeAuthorityId?: number | null
}

// ========== 최저시급 ==========

export interface MinimumWageInfo {
  year: number
  minimumWage: number
}

// ========== 직원 타입별 목록 ==========

export interface EmployeeSimpleListResponse {
  employeeInfoId: number
  memberId: number | null
  employeeNumber: string
  employeeName: string
  headOfficeName: string
  franchiseName: string | null
  storeName: string | null
  contractClassification: string | null
  contractClassificationName: string | null
  employmentContractId: number | null
  salaryMonth: string | null
  salaryDay: number | null
}

export interface GetEmployeeListByTypeParams {
  headOfficeId: number
  franchiseId?: number
  employeeType: EmployeeType
}

// ========== 사번 중복 확인 ==========

export interface CheckEmployeeNumberResult {
  isDuplicate: boolean
  message: string
}

// ========== 직원 정보 공통코드 ==========

export interface ClassificationItem {
  code: string
  name: string
  sortOrder: number
}

export interface EmployeeInfoCommonCodeResponse {
  codeId: number
  code: string
  codeMemoContent: {
    EMPLOYEE?: ClassificationItem[]
    RANK?: ClassificationItem[]
    POSITION?: ClassificationItem[]
  } | null
}
