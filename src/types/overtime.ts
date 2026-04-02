import type { PaginatedResponse } from '@/types/payroll'

// 초과근무 수당 지급항목 (일별 연장근무 기록)
export interface OvertimeAllowanceItemDto {
  id?: number
  workDay: string                    // YYYY-MM-DD
  workHour: number                   // 총 근무시간
  breakTimeHour: number              // 휴게시간
  contractTimelyAmount: number       // 계약 시급
  applyTimelyAmount: number          // 적용 시급
  expectedOvertimeHours?: number     // 예상 연장근무시간
  actualOvertimeHours: number        // 실제 연장근무시간
  overtimeStartTime?: string         // HH:mm
  overtimeEndTime?: string           // HH:mm
  deductionAmount: number            // 공제액 = actualPaymentAmount × 0.033
  actualPaymentAmount: number        // 지급액 = actualOvertimeHours × applyTimelyAmount
  remarks?: string
}

// 초과근무 수당명세서 상세 응답
export interface OvertimeAllowanceDetail {
  id: number
  memberId: number
  memberName: string
  workStatus?: string
  headOfficeName?: string
  franchiseName?: string
  storeName?: string
  employeeClassification?: string
  employeeClassificationName?: string
  allowanceYearMonth: string
  calculationStartDate: string
  calculationEndDate: string
  totalWorkDays: number
  totalOvertimeHours: number
  grossOvertimeAmount: number
  totalDeductionAmount: number
  totalAmount: number
  actualOvertimeAmount: number
  paymentDate?: string
  remarks?: string
  isEmailSend: boolean
  details: OvertimeAllowanceItemDto[]
  createdAt?: string
  updatedAt?: string
  createdByName?: string
  updatedByName?: string
}

// 초과근무 수당명세서 목록 항목
export interface OvertimeAllowanceListItem {
  id: number
  memberId: number
  memberName: string
  workStatus?: string
  headOfficeName?: string
  franchiseName?: string
  storeName?: string
  employeeClassification?: string
  employeeClassificationName?: string
  workDays?: string
  allowanceYearMonth: string
  paymentDate?: string
  isEmailSend: boolean
  createdAt: string
}

// 검색 파라미터
export interface OvertimeSearchParams {
  headOfficeId?: number
  franchiseStoreId?: number
  storeId?: number
  workStatus?: string
  memberName?: string
  workDays?: string[]
  contractClassification?: string
  employeeClassification?: string
  allowanceYearMonth?: string
  paymentStartDate?: string
  paymentEndDate?: string
  page: number
  size: number
}

// 등록 요청
export interface OvertimeAllowanceCreateRequest {
  employeeInfoId: number
  allowanceYearMonth: string
  calculationStartDate: string
  calculationEndDate: string
  paymentDate?: string
  remarks?: string
  details: Omit<OvertimeAllowanceItemDto, 'id'>[]
}

// 수정 요청
export interface OvertimeAllowanceUpdateRequest {
  allowanceYearMonth: string
  calculationStartDate: string
  calculationEndDate: string
  paymentDate?: string
  remarks?: string
  details: OvertimeAllowanceItemDto[]
}

// 일별 연장근무 시간 조회 파라미터
export interface GetDailyOvertimeHoursParams {
  headOfficeId?: number
  franchiseStoreId?: number
  storeId?: number
  employeeInfoId: number
  startDate: string
  endDate: string
}

// 일별 연장근무 기록
export interface DailyOvertimeRecord {
  type: 'DAILY'
  date: string
  dayOfWeek: string
  dayOfWeekKorean: string
  overtimeHours: number
  overtimeStartTime?: string
  overtimeEndTime?: string
  contractTimelyAmount: number
  applyTimelyAmount: number
  paymentAmount: number
  deductionAmount: number
  totalAmount: number
}

// 주간소계
export interface WeeklyOvertimeSubtotal {
  type: 'WEEKLY_SUBTOTAL'
  weekStartDate: string
  weekEndDate: string
  weekNumber: number
  totalOvertimeHours: number
  totalPaymentAmount: number
  totalDeductionAmount: number
}

export type DailyOvertimeHoursItem = DailyOvertimeRecord | WeeklyOvertimeSubtotal

// 일별 연장근무 시간 요약 응답
export interface DailyOvertimeHoursSummaryResponse {
  employeeInfoId: number
  memberId: number
  memberName: string
  startDate: string
  endDate: string
  applyTimelyAmount: number
  items: DailyOvertimeHoursItem[]
  grandTotalOvertimeHours: number
  grandTotalPaymentAmount: number
  grandTotalDeductionAmount: number
  grandTotalAmount: number
}

export type { PaginatedResponse }
