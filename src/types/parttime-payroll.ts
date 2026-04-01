import type { PaginatedResponse } from '@/types/payroll'

// 파트타이머 지급항목 (일별 근무 기록)
export interface PartTimerPaymentItem {
  id?: number
  workDay: string              // YYYY-MM-DD
  workHour: number             // 근무시간
  breakTimeHour: number        // 휴게시간
  contractTimelyAmount: number // 계약 시급
  applyTimelyAmount: number    // 적용 시급
  totalAmount: number          // 지급액 = (workHour - breakTimeHour) * applyTimelyAmount
  deductionAmount: number      // 공제액 = totalAmount * 0.033
  remarks?: string
}

// 파트타이머 공제항목
export interface PartTimerDeductionItem {
  id?: number
  itemCode: string   // NATIONAL_PENSION, HEALTH_INSURANCE 등
  itemOrder: number
  amount: number
  remarks?: string
  displayName?: string
}

// 주휴수당
export interface WeeklyPaidHolidayAllowance {
  id: number
  workWeek: number              // 주 차수
  workTime: number              // 주휴수당 인정 시간
  applyTimelyAmount: number     // 적용 시급
  totalAmount: number           // 주휴수당 금액
  deductionAmount: number       // 공제액
  netAmount: number             // 차인금액
  remarks?: string
  weekStartDate?: string        // 주 시작일
  weekEndDate?: string          // 주 종료일
  isCrossMonth: boolean         // 월 경계 여부
}

// 파트타이머 급여명세서 상세 응답
export interface PartTimerPayrollDetail {
  id: number
  memberId: number
  memberName: string
  workStatus?: string
  employeeClassification?: string
  employeeClassificationName?: string
  headOfficeName?: string
  franchiseName?: string
  storeName?: string
  workDays?: string
  payrollYearMonth: string
  settlementStartDate: string
  settlementEndDate: string
  paymentDate: string
  totalAmount: number
  totalDeductionAmount: number
  actualPaymentAmount: number
  remarks?: string
  isEmailSend: boolean
  paymentItems: PartTimerPaymentItem[]
  deductionItems: PartTimerDeductionItem[]
  weeklyPaidHolidayAllowances: WeeklyPaidHolidayAllowance[]
  createdAt?: string
  updatedAt?: string
  createdByName?: string
  updatedByName?: string
}

// 파트타이머 급여명세서 목록 항목
export interface PartTimerPayrollListItem {
  id: number
  memberId: number
  memberName: string
  workStatus?: string
  employeeClassification?: string
  employeeClassificationName?: string
  headOfficeName?: string
  franchiseName?: string
  storeName?: string
  workDays?: string
  payrollYearMonth: string
  paymentDate: string
  totalAmount: number
  totalDeductionAmount: number
  actualPaymentAmount: number
  isEmailSend: boolean
  createdAt: string
}

// 검색 파라미터
export interface PartTimerPayrollSearchParams {
  headOfficeId?: number
  franchiseStoreId?: number
  storeId?: number
  workStatus?: string
  memberName?: string
  workDays?: string[]
  paymentStartDate?: string
  paymentEndDate?: string
  page: number
  size: number
}

// 등록 요청
export interface PartTimerPayrollCreateRequest {
  employeeInfoId: number
  payrollYearMonth: string
  settlementStartDate: string
  settlementEndDate: string
  paymentDate: string
  paymentItems: Omit<PartTimerPaymentItem, 'id'>[]
  deductionItems?: Omit<PartTimerDeductionItem, 'id' | 'displayName'>[]
  remarks?: string
}

// 수정 요청
export interface PartTimerPayrollUpdateRequest {
  payrollYearMonth: string
  settlementStartDate: string
  settlementEndDate: string
  paymentDate: string
  paymentItems: PartTimerPaymentItem[]
  deductionItems?: PartTimerDeductionItem[]
  remarks?: string
}

// 일별 근무 기록 (daily-work-hours API 응답)
export interface DailyWorkRecord {
  date: string
  dayOfWeek: string
  dayOfWeekKorean: string
  workHours: number
  applyTimelyAmount: number
  paymentAmount: number
  deductionAmount: number
  totalAmount: number
}

export interface WeeklySubtotal {
  weekNumber: number
  totalWorkHours: number
  totalPaymentAmount: number
  totalDeductionAmount: number
  totalAmount: number
}

export interface WeeklyHolidayAllowanceItem {
  weekNumber: number
  workTime: number
  applyTimelyAmount: number
  totalAmount: number
  deductionAmount: number
  netAmount: number
}

export interface WeeklyTotal {
  weekNumber: number
  totalAmount: number
}

export type WorkHoursItemType = 'DAILY' | 'WEEKLY_SUBTOTAL' | 'WEEKLY_HOLIDAY_ALLOWANCE' | 'WEEKLY_TOTAL'

export interface DailyWorkHoursItem {
  type: WorkHoursItemType
  dailyRecord?: DailyWorkRecord
  weeklySubtotal?: WeeklySubtotal
  weeklyHolidayAllowance?: WeeklyHolidayAllowanceItem
  weeklyTotal?: WeeklyTotal
}

export interface DailyWorkHoursSummaryResponse {
  memberId: number
  memberName: string
  startDate: string
  endDate: string
  applyTimelyAmount: number
  contractHourlyWageInfo: {
    weekDayHourlyWage: number
    overtimeHourlyWage: number
    holidayHourlyWage: number
  }
  items: DailyWorkHoursItem[]
  grandTotalWorkHours: number
  grandTotalPaymentAmount: number
  grandTotalDeductionAmount: number
  grandTotalAmount: number
  previousMonthWorkHours: number
}

export interface GetDailyWorkHoursParams {
  headOfficeId?: number
  franchiseStoreId?: number
  storeId?: number
  employeeInfoId: number
  startDate: string
  endDate: string
}

export type { PaginatedResponse }
