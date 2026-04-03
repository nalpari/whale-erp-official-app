import type { EmployeeOption } from '@/types/todo'

// 근무 계획표 계약 유형
export type ScheduleContractType = '정직원' | '계약직' | '수습' | '파트타이머' | '임시근무'

// schedule 화면 전용 직원 옵션 (API 응답에 contractType 포함)
export interface ScheduleEmployeeOption extends EmployeeOption {
  contractType: ScheduleContractType
}

// 아바타 아이콘 인덱스 (0~3, getWorkerAvatar 참조)
export type WorkerIconType = 0 | 1 | 2 | 3

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
  contractType: ScheduleContractType
  workStartTime: string | null
  workEndTime: string | null
  breakStartTime: string | null
  breakEndTime: string | null
  hasWork: boolean
  hasBreak: boolean
  isDeleted: boolean
  iconType: WorkerIconType
}

// 생성/수정 요청
export interface ScheduleRequest {
  date: string
  workerRequests: WorkerRequest[]
}

// workerId(등록 직원)와 tempWorkerName(임시 근무자)은 상호 배타
interface WorkerRequestBase {
  shiftId?: number
  hasWork: boolean
  workStartTime?: string
  workEndTime?: string
  hasBreak: boolean
  breakStartTime?: string
  breakEndTime?: string
  iconType?: WorkerIconType
  isDeleted?: boolean
}

interface RegisteredWorkerRequest extends WorkerRequestBase {
  workerId: number
  tempWorkerName?: never
}

interface TempWorkerRequest extends WorkerRequestBase {
  workerId?: never
  tempWorkerName: string
}

export type WorkerRequest = RegisteredWorkerRequest | TempWorkerRequest

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

// 엑셀 검증 결과 (valid에 따라 schedules 존재 여부가 결정되는 discriminated union)
interface ExcelValidationBase {
  totalRows: number
  validRows: number
  invalidRows: number
  errors: { rowNumber: number; message: string }[]
}

interface ExcelValidationSuccess extends ExcelValidationBase {
  valid: true
  schedules: ScheduleRequest[]
}

interface ExcelValidationFailure extends ExcelValidationBase {
  valid: false
  schedules: null
}

export type ExcelValidationResponse = ExcelValidationSuccess | ExcelValidationFailure

// 수립 페이지 로컬 편집 상태 (WorkerResponse 필드 + isNew 플래그)
export interface WorkerEditItem extends WorkerResponse {
  isNew: boolean
}

// 바텀시트 직원 목록 항목
export interface WorkerSheetEmployee {
  id: number
  memberId: number | null
  name: string
  contractType: ScheduleContractType
  employeeNumber?: string
}
