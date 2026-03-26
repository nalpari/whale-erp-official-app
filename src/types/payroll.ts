// 페이지네이션 공통 응답
export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// 급여명세서 목록 항목
export interface PayrollStatementListItem {
  id: number
  employeeInfoId: number
  employeeName: string
  employeeNumber: string
  employeeClassification: string
  workStatus: string
  payrollYearMonth: string
  paymentDate: string
  totalPaymentAmount: number
  totalDeductionAmount: number
  actualPaymentAmount: number
  isEmailSend: boolean
  headOfficeName: string
  franchiseName?: string
  storeName?: string
  createdAt: string
  updatedAt?: string
}

// 지급 항목
export interface PaymentItem {
  id?: number
  itemCode: string
  itemOrder: number
  amount: number
  remarks?: string
}

// 공제 항목
export interface DeductionItem {
  id?: number
  itemCode: string
  itemOrder: number
  amount: number
  remarks?: string
}

// 상여금
export interface BonusItem {
  id?: number
  bonusCode?: string
  bonusType: string
  amount: number
  memo?: string
}

// 급여명세서 상세 응답
export interface PayrollStatementDetail {
  id: number
  employmentContractId: number
  employeeInfoId: number
  employeeName: string
  employeeNumber: string
  payrollYearMonth: string
  settlementStartDate: string
  settlementEndDate: string
  paymentDate: string
  totalPaymentAmount: number
  totalDeductionAmount: number
  actualPaymentAmount: number
  attachmentFileId?: number
  remarks?: string
  isEmailSend: boolean
  paymentItems: PaymentItem[]
  deductionItems: DeductionItem[]
  bonuses: BonusItem[]
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
}

// 검색 파라미터 (API: GetPayrollStatementRequest 기준)
export interface PayrollSearchParams {
  headOfficeId?: number             // API 필수지만 프론트에서는 미선택 상태(undefined) 허용
  franchiseStoreId?: number         // 가맹점 코드
  storeId?: number                  // 점포 코드
  workStatus?: string               // EMPWK_001: 근무, EMPWK_002: 휴직, EMPWK_003: 퇴사
  memberName?: string               // 회원명
  employeeClassification?: string   // 직원 분류 코드
  payrollYearMonth?: string         // YYYYMM
  paymentStartDate?: string         // 지급 시작일
  paymentEndDate?: string           // 지급 종료일
  page: number
  size: number
}

// 생성/수정 요청
export interface PayrollStatementCreateRequest {
  employmentContractId: number
  payrollYearMonth: string
  settlementStartDate: string
  settlementEndDate: string
  paymentDate: string
  paymentItems: Omit<PaymentItem, 'id'>[]
  deductionItems: Omit<DeductionItem, 'id'>[]
  remarks?: string
}

export interface PayrollStatementUpdateRequest {
  payrollYearMonth: string
  settlementStartDate: string
  settlementEndDate: string
  paymentDate: string
  paymentItems: PaymentItem[]
  deductionItems: DeductionItem[]
  remarks?: string
}

// 지급항목 코드
export const PAYMENT_ITEM_CODES = {
  BASIC: '기본급',
  BONUS: '상여',
  MEAL: '식대',
  VEHICLE: '자가운전보조금',
  CHILD_CARE: '육아수당',
  OVERTIME: '연장수당',
  NIGHT: '야간수당',
  MONTHLY_HOLIDAY: '휴일근무수당',
  ANNUAL_LEAVE: '연차수당',
  ADD: '추가근무수당',
} as const

// 공제항목 코드
export const DEDUCTION_ITEM_CODES = {
  NATIONAL_PENSION: '국민연금',
  HEALTH_INSURANCE: '건강보험',
  EMPLOYMENT_INSURANCE: '고용보험',
  LONG_TERM_CARE_INSURANCE: '장기요양보험',
  INCOME_TAX: '소득세',
  LOCAL_INCOME_TAX: '지방소득세',
} as const
