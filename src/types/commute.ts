/** 일별 표시 상태: 근무 / 결근 / 휴일 */
export type CommuteDayDisplayStatus = '근무' | '결근' | '휴일'

// ─── 목록 ────────────────────────────────────────────────────────────────────

/** GET /api/v1/employee/attendances 단건 응답 */
export interface AttendanceListItem {
  contractId: number
  employeeId: number
  workStatus: string // '근무 중' | '휴직 중' | '퇴사'
  officeId: number | null
  officeName: string | null
  franchiseId: number | null
  franchiseName: string | null
  storeId: number | null
  storeName: string | null
  employeeName: string | null
  employeeClassify: string | null
  contractClassify: string | null
  workDay: string[] // ['평일 전체', '토요일'] 등
  iconType: number // 0: 기본, 1~3: 아이콘
}

/** GET /api/v1/employee/attendances 페이징 응답 */
export interface AttendanceListResponse {
  content: AttendanceListItem[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  isFirst: boolean
  isLast: boolean
  hasNext: boolean
}

/** 목록 조회 파라미터 */
export interface AttendanceListParams {
  officeId: number
  franchiseId?: number
  storeId?: number
  status?: string
  employeeName?: string
  dayType?: Array<'WEEKDAY' | 'SATURDAY' | 'SUNDAY'>
  employeeClassify?: string
  contractClassify?: string
  page?: number
  size?: number
}

// ─── 상세 ────────────────────────────────────────────────────────────────────

/** GET /api/v1/employee/attendances/records 단건 근무 기록 */
export interface AttendanceRecord {
  recordId: number | null // 기록 없는 날짜는 null
  date: string // YYYY-MM-DD
  day: string // '월요일' 등
  isHoliday: boolean
  contractStartTime: string | null // HH:mm:ss
  contractEndTime: string | null // HH:mm:ss
  workStartTime: string | null // HH:mm:ss
  workEndTime: string | null // HH:mm:ss
}

/** 요일별 계약 근무시간 */
export interface ContractWorkHour {
  dayType: string // MONDAY~SUNDAY, WEEKDAY
  workStartTime: string | null
  workEndTime: string | null
  breakStartTime: string | null
  breakEndTime: string | null
  isBreak: boolean
}

/** GET /api/v1/employee/attendances/records 응답 */
export interface AttendanceDetailResponse {
  officeId: number
  officeName: string
  franchiseId: number | null
  franchiseName: string | null
  storeId: number | null
  storeName: string | null
  employeeId: number | null
  employeeName: string | null
  employeeNumber: string | null
  iconType: number
  rank: string | null
  position: string | null
  workplaceType: string | null // HEAD_OFFICE | FRANCHISE | STORE
  workStatus: string | null
  contractClassification: string
  employeeClassify: string | null
  contractWorkHours: ContractWorkHour[]
  dateFrom: string // YYYY-MM-DD
  dateEnd: string // YYYY-MM-DD
  record: AttendanceRecord[]
}

/** 상세 조회 파라미터 */
export interface AttendanceDetailParams {
  officeId: number
  franchiseId?: number
  storeId?: number
  employeeId: number
  from?: string // YYYY-MM-DD
  to?: string // YYYY-MM-DD
}
