// 목록 조회 응답
export interface ScheduleResponse {
  storeId: number | null
  storeName: string | null
  scheduleId: number | null
  date: string // "2025-02-01"
  day: string // "월", "토"
  workerList: WorkerResponse[]
}

export interface WorkerResponse {
  shiftId: number | null
  workerId: number | null
  workerName: string
  contractType: string // "정직원", "파트타이머", "임시근무" 등
  workStartTime: string | null
  workEndTime: string | null
  breakStartTime: string | null
  breakEndTime: string | null
  hasWork: boolean
  hasBreak: boolean
  isDeleted: boolean
}

// 생성/수정 요청
export interface ScheduleRequest {
  date: string
  workerRequests: WorkerRequest[]
}

export interface WorkerRequest {
  shiftId?: number | null
  workerId?: number | null
  tempWorkerName?: string | null
  hasWork: boolean
  workStartTime?: string | null
  workEndTime?: string | null
  hasBreak: boolean
  breakStartTime?: string | null
  breakEndTime?: string | null
  isDeleted?: boolean
}

// 저장 결과
export interface ScheduleSummary {
  id: number
  date: string
}

// 검색 파라미터
export interface ScheduleSearchParams {
  officeId: number
  franchiseId?: number
  storeId?: number
  employeeName?: string
  dayType?: string
  from: string
  to: string
}

// 엑셀 검증 결과
export interface ExcelValidationResponse {
  valid: boolean
  totalRows: number
  validRows: number
  invalidRows: number
  schedules: ScheduleRequest[] | null
  errors: { rowNumber: number; message: string }[]
}

// 수립 페이지 로컬 편집 상태
export interface WorkerEditItem {
  shiftId: number | null
  workerId: number | null
  workerName: string
  contractType: string
  hasWork: boolean
  workStartTime: string | null
  workEndTime: string | null
  hasBreak: boolean
  breakStartTime: string | null
  breakEndTime: string | null
  isDeleted: boolean
  isNew: boolean
}
