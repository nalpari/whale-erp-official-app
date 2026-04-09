import type { PaginatedResponse } from '@/types/payroll'

// Enums
export type ContractType = 'ECNT_001' | 'ECNT_002'  // 서류계약 | 전자계약
export type ContractClassificationType = 'CNTCFWK_001' | 'CNTCFWK_002' | 'CNTCFWK_003'  // 포괄 | 비포괄 | 파트타임
export type ElectronicContractStatus = 'WRITING' | 'PROGRESS' | 'COMPLETE' | 'REFUSAL'
export type SalaryCycle = 'SLRCC_001' | 'SLRCC_002'  // 시급제 | 월급제
export type SalaryMonth = 'SLRCF_001' | 'SLRCF_002'  // 당월 | 익월

// 계약분류 상수
export const CONTRACT_COMPREHENSIVE: ContractClassificationType = 'CNTCFWK_001'  // 포괄연봉제
export const CONTRACT_NON_COMPREHENSIVE: ContractClassificationType = 'CNTCFWK_002'  // 비포괄연봉제
export const CONTRACT_PART_TIME: ContractClassificationType = 'CNTCFWK_003'  // 파트타임

// 기본값 상수
export const DEFAULT_CONTRACT_TYPE: ContractType = 'ECNT_001'
export const DEFAULT_SALARY_CYCLE: SalaryCycle = 'SLRCC_001'
export const DEFAULT_SALARY_MONTH: SalaryMonth = 'SLRCF_001'
export type DayType = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY' | 'WEEKDAY' | 'WEEKEND'

// 계약 목록 항목
export interface ContractListItem {
  id: number
  employeeInfoId: number
  employeeInfoName: string
  employeeNumber?: string
  workStatus?: string
  workStatusName?: string
  headOfficeOrganizationName?: string
  franchiseOrganizationName?: string
  storeName?: string
  employmentContractHeader?: {
    contractType: ContractType
    contractTypeName: string
    electronicContractStatus: ElectronicContractStatus
    contractClassification: ContractClassificationType
    contractClassificationName: string
    nationalPensionEnrolled?: boolean
    healthInsuranceEnrolled?: boolean
    employmentInsuranceEnrolled?: boolean
    workersCompensationEnrolled?: boolean
    salaryCycle: SalaryCycle
    salaryCycleName: string
    salaryMonth: SalaryMonth
    salaryMonthName: string
    salaryDay: number
    contractStartDate: string
    contractEndDate: string
    contractDate: string
    jobDescription: string
    workContractFile?: ContractFile
    wageContractFile?: ContractFile
  }
  workHours?: ContractWorkHour[]
  createdAt: string
}

// 근무시간
export interface ContractWorkHour {
  id?: number
  dayType: DayType
  isWork: boolean
  isBreak: boolean
  everySaturdayWork: boolean
  firstSaturdayWorkDay?: string
  everySundayWork: boolean
  firstSundayWorkDay?: string
  workStartTime?: string
  workEndTime?: string
  breakStartTime?: string
  breakEndTime?: string
}

// 급여정보 (API 응답: EmploymentContractSalaryInfoResponse 기준)
export interface ContractSalaryInfo {
  id?: number
  annualSalary: number
  monthlyTotalSalary: number
  timelySalary: number
  monthlyTime: number
  monthlyBaseSalary: number
  monthlyOvertimeAllowanceTime?: number
  monthlyOvertimeAllowance?: number
  monthlyNightAllowanceTime?: number
  monthlyNightAllowance?: number
  monthlyHolidayAllowanceTime?: number
  monthlyHolidayAllowance?: number
  monthlyAddHolidayAllowanceTime?: number
  monthlyAddHolidayAllowance?: number
  mealAllowance?: number
  vehicleAllowance?: number
  childcareAllowance?: number
  weekDayAllowanceAmount?: number
  overtimeDayAllowanceAmount?: number
  nightDayAllowanceAmount?: number
  holidayAllowanceTimeAmount?: number
  bonuses?: ContractBonus[]
}

// 상여금 (API 응답: bonusCode/bonusType/amount, 레거시: bonusName/bonusAmount)
export interface ContractBonus {
  id?: number
  bonusCode?: string
  bonusType?: string
  bonusName?: string
  amount?: number
  bonusAmount?: number
  deductionAmount?: number
  isActive?: boolean
  itemOrder?: number
  memo?: string
}

// 파일 정보
export interface ContractFile {
  id: number
  fileName: string
  fileUrl: string
}

// 계약 상세 응답
export interface ContractDetail {
  id: number
  member?: {
    id: number
    name: string
    loginId: string
    email?: string
  }
  employeeInfoId?: number
  employeeInfoName?: string
  headOfficeOrganizationId?: number
  headOfficeOrganizationName?: string
  franchiseOrganizationId?: number
  franchiseOrganizationName?: string
  storeId?: number
  storeName?: string
  workStatus?: string
  workStatusName?: string
  employmentContractHeader?: {
    id: number
    contractType: ContractType
    contractTypeName: string
    electronicContractStatus: ElectronicContractStatus
    contractClassification: ContractClassificationType
    contractClassificationName: string
    nationalPensionEnrolled: boolean
    healthInsuranceEnrolled: boolean
    employmentInsuranceEnrolled: boolean
    workersCompensationEnrolled: boolean
    salaryCycle: SalaryCycle
    salaryCycleName: string
    salaryMonth: SalaryMonth
    salaryMonthName: string
    salaryDay: number
    contractStartDate: string
    contractEndDate: string
    contractDate: string
    jobDescription: string
    workContractFile?: ContractFile
    wageContractFile?: ContractFile
  }
  salaryInfo?: ContractSalaryInfo
  workHours?: ContractWorkHour[]
  createdBy?: string
  createdByName?: string
  createdAt?: string
  updatedBy?: string
  updatedByName?: string
  updatedAt?: string
}

// 검색 파라미터
export interface ContractSearchParams {
  headOfficeId?: number
  franchiseId?: number
  storeId?: number
  workStatus?: string
  memberName?: string
  workDays?: string[]
  memberClassification?: string
  contractClassification?: ContractClassificationType
  contractStatus?: string
  electronicContract?: string[]
  paymentStartDate?: string
  paymentEndDate?: string
  contractStartDt?: string
  contractEndDt?: string
  page: number
  size: number
}

// 헤더 등록 요청
export interface ContractHeaderCreateRequest {
  employeeInfoId: number
  memberId: number
  headOfficeOrganizationId: number
  franchiseOrganizationId?: number
  storeId?: number
  contractType: ContractType
  electronicContractStatus?: ElectronicContractStatus
  contractClassification: ContractClassificationType
  nationalPensionEnrolled?: boolean
  healthInsuranceEnrolled?: boolean
  employmentInsuranceEnrolled?: boolean
  workersCompensationEnrolled?: boolean
  salaryCycle: SalaryCycle
  salaryMonth: SalaryMonth
  salaryDay: number
  contractStartDate: string
  contractEndDate: string
  contractDate: string
  jobDescription: string
}

// 헤더 수정 요청
export interface ContractHeaderUpdateRequest {
  headerId: number
  contractType: ContractType
  electronicContractStatus?: ElectronicContractStatus
  contractClassification: ContractClassificationType
  nationalPensionEnrolled?: boolean
  healthInsuranceEnrolled?: boolean
  employmentInsuranceEnrolled?: boolean
  workersCompensationEnrolled?: boolean
  salaryCycle: SalaryCycle
  salaryMonth: SalaryMonth
  salaryDay: number
  contractStartDate: string
  contractEndDate: string
  contractDate: string
  jobDescription: string
  workContractFileId?: number
  wageContractFileId?: number
}

// 근무시간 등록/수정 요청
export interface ContractWorkHoursRequest {
  contractId: number
  workHours: ContractWorkHour[]
}

// 급여정보 등록 요청
export interface ContractSalaryInfoCreateRequest {
  contractId: number
  annualAmount: number
  monthlyTotalAmount: number
  timelyAmount: number
  monthlyTime: number
  monthlyBaseAmount: number
  monthlyOvertimeAllowanceTime?: number
  monthlyOvertimeAllowanceAmount?: number
  monthlyNightAllowanceTime?: number
  monthlyNightAllowanceAmount?: number
  monthlyHolidayAllowanceTime?: number
  monthlyHolidayAllowanceAmount?: number
  monthlyAddHolidayAllowanceTime?: number
  monthlyAddHolidayAllowanceAmount?: number
  mealAllowanceAmount?: number
  vehicleAllowanceAmount?: number
  childcareAllowanceAmount?: number
  weekDayAllowanceAmount?: number
  overtimeDayAllowanceAmount?: number
  nightDayAllowanceAmount?: number
  holidayAllowanceTimeAmount?: number
  bonuses?: ContractBonus[]
}

// 급여정보 수정 요청
export interface ContractSalaryInfoUpdateRequest extends ContractSalaryInfoCreateRequest {
  id: number
}

// 최저임금 응답
export interface MinimumWageResponse {
  year: number
  minimumWage: number
}

export type { PaginatedResponse }
