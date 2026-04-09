import type { OperatingHour, OperatingHourRequest } from '@/types/store'

// ── 공통 상수 ──

export const OPERATION_STATUS = {
  OPERATING: 'STOPR_001',
  NOT_OPERATING: 'STOPR_002',
} as const

export const STATUS_MAP: Record<string, { label: string; className: string }> = {
  [OPERATION_STATUS.OPERATING]: { label: '운영', className: 'badge blue' },
  [OPERATION_STATUS.NOT_OPERATING]: { label: '미운영', className: 'badge red' },
}

export const WEEKDAY_LABEL: Record<string, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
}

export const WEEKDAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'] as const
export const ALL_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const

export interface StoreFormValidationState {
  storeOwner: string
  officeId: number | null
  franchiseId: number | null
  storeName: string
  ceoName: string
  businessNumber: string
  storeAddress: string
  ceoPhone: string
}

export type StoreFocusableField =
  | 'officeId'
  | 'franchiseId'
  | 'storeName'
  | 'ceoName'
  | 'businessNumber'
  | 'storeAddress'
  | 'ceoPhone'

/** 오늘 날짜를 YYYY-MM-DD 로컬 타임존 문자열로 반환 */
export function getToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ── 에러 → 스텝 매핑 ──

/** API 에러 details 필드명 → 점포 폼 step 번호 */
const STORE_FIELD_STEP: Record<string, number> = {
  // Step 1: 기본 정보
  storeOwner: 1, organizationId: 1, storeName: 1, operationStatus: 1,
  // Step 2: 연락처
  ceoName: 2, businessNumber: 2, storeAddress: 2, storeAddressDetail: 2, ceoPhone: 2, storePhone: 2,
}

const STORE_FIELD_ERROR_MESSAGE: Record<string, string> = {
  storeOwner: '점포 소유 구분을 확인해주세요.',
  organizationId: '본사 또는 가맹점을 선택해주세요.',
  storeName: '점포명을 입력해주세요.',
  operationStatus: '운영 여부를 확인해주세요.',
  ceoName: '대표자명을 입력해주세요.',
  businessNumber: '사업자등록번호를 확인해주세요.',
  storeAddress: '점포주소를 입력해주세요.',
  storeAddressDetail: '상세주소를 확인해주세요.',
  ceoPhone: '대표자 연락처를 확인해주세요.',
  storePhone: '점포 전화번호를 확인해주세요.',
}

/** 에러 details에서 이동해야 할 가장 앞 스텝 번호 반환 */
export function getStoreErrorStep(details: Record<string, string>): number | null {
  let min: number | null = null
  for (const field of Object.keys(details)) {
    const step = STORE_FIELD_STEP[field]
    if (step !== undefined && (min === null || step < min)) {
      min = step
    }
  }
  return min
}

/** 에러 details를 사용자용 메시지로 매핑해 줄바꿈으로 반환 */
export function formatStoreErrorDetails(details: Record<string, string>): string {
  const messages = Object.keys(details).map((field) => (
    STORE_FIELD_ERROR_MESSAGE[field] ?? '입력값을 확인해주세요.'
  ))
  return Array.from(new Set(messages)).join('\n')
}

// ── 패턴 검증 ──

/** 사업자등록번호 형식 검증 (XXX-XX-XXXXX) */
export function isValidBusinessNumber(value: string): boolean {
  return /^\d{3}-\d{2}-\d{5}$/.test(value)
}

/** 전화번호 형식 검증 (02-XXX(X)-XXXX 또는 0XX-XXX(X)-XXXX) */
export function isValidPhoneNumber(value: string): boolean {
  return /^0\d{1,2}-\d{3,4}-\d{4}$/.test(value)
}

/** 점포 폼 Step 유효성 검증 */
export function validateStoreStep(step: number, state: StoreFormValidationState): boolean {
  switch (step) {
    case 1:
      if (state.storeOwner === 'FRANCHISE' && !state.franchiseId) return false
      return !!state.officeId && !!state.storeName
    case 2:
      if (!state.ceoName || !state.businessNumber || !state.storeAddress || !state.ceoPhone) return false
      if (!isValidBusinessNumber(state.businessNumber)) return false
      if (!isValidPhoneNumber(state.ceoPhone)) return false
      return true
    default:
      return true
  }
}

/** 여러 step 중 가장 먼저 실패하는 step 반환 */
export function getFirstInvalidStoreStep(
  state: StoreFormValidationState,
  steps: number[] = [1, 2],
): number | null {
  for (const step of steps) {
    if (!validateStoreStep(step, state)) return step
  }
  return null
}

/** 점포 폼에서 가장 먼저 포커스해야 할 필드 반환 */
export function getFirstInvalidStoreField(state: StoreFormValidationState): StoreFocusableField | null {
  if (!state.officeId) return 'officeId'
  if (state.storeOwner === 'FRANCHISE' && !state.franchiseId) return 'franchiseId'
  if (!state.storeName) return 'storeName'
  if (!state.ceoName) return 'ceoName'
  if (!state.businessNumber || !isValidBusinessNumber(state.businessNumber)) return 'businessNumber'
  if (!state.storeAddress) return 'storeAddress'
  if (!state.ceoPhone || !isValidPhoneNumber(state.ceoPhone)) return 'ceoPhone'
  return null
}

export interface OperatingHourValidationResult {
  hasOperatingTimeRangeError: boolean
  hasBreakTimeRangeError: boolean
  hasBreakOutsideOperatingError: boolean
  isValid: boolean
}

function isEndBeforeStart(start?: string | null, end?: string | null): boolean {
  if (!start || !end) return false
  return end <= start
}

/** 영업시간/휴게시간 검증 */
export function getOperatingHourValidation(hour: OperatingHourRequest): OperatingHourValidationResult {
  const hasOperatingTimeRangeError = isEndBeforeStart(hour.openTime, hour.closeTime)
  const hasBreakTimeRangeError = isEndBeforeStart(hour.breakStartTime, hour.breakEndTime)

  const hasBreak = !!(hour.breakStartTime && hour.breakEndTime)
  const hasOperatingTime = !!(hour.openTime && hour.closeTime)
  const hasBreakOutsideOperatingError = hasBreak && (
    !hasOperatingTime
    || hour.breakStartTime < hour.openTime
    || hour.breakEndTime > hour.closeTime
  )

  return {
    hasOperatingTimeRangeError,
    hasBreakTimeRangeError,
    hasBreakOutsideOperatingError,
    isValid: !hasOperatingTimeRangeError && !hasBreakTimeRangeError && !hasBreakOutsideOperatingError,
  }
}

/** 점포 영업시간 전체 유효성 검증 */
export function validateStoreOperatingHours(operating: OperatingHourRequest[]): boolean {
  return operating.every((hour) => getOperatingHourValidation(hour).isValid)
}

// ── 공통 유틸 함수 ──

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  return dateStr.slice(0, 10).replace(/-/g, '.')
}

export function formatTime(timeStr?: string | null): string {
  if (!timeStr) return ''
  return timeStr.slice(0, 5)
}

export function getFileNameAndExt(fileName: string): { name: string; ext: string } {
  const lastDot = fileName.lastIndexOf('.')
  if (lastDot === -1) return { name: fileName, ext: '' }
  return { name: fileName.slice(0, lastDot), ext: fileName.slice(lastDot) }
}

/** storeOwner 기반으로 organizationId를 결정하는 공통 로직 */
export function getOrganizationId(
  storeOwner: string,
  officeId: number | null,
  franchiseId?: number | null,
): number {
  if (storeOwner === 'FRANCHISE' && franchiseId) return franchiseId
  if (!officeId) throw new Error('본사가 선택되지 않았습니다.')
  return officeId
}

/**
 * 서버 응답의 개별 요일 데이터를 폼의 WEEKDAY/SATURDAY/SUNDAY 구조로 역변환
 *
 * 서버는 WEEKDAY를 MONDAY~FRIDAY 개별로 확장 저장하므로,
 * 조회 시 개별 요일로 내려온 데이터를 폼에서 사용하는 WEEKDAY 구조로 합쳐야 함
 */
export function toFormOperating(serverOperating: OperatingHour[]): OperatingHourRequest[] {
  const weekdayEntries = serverOperating.filter((o) =>
    (WEEKDAY_ORDER as readonly string[]).includes(o.dayType) && o.isOperating
  )
  const saturday = serverOperating.find((o) => o.dayType === 'SATURDAY')
  const sunday = serverOperating.find((o) => o.dayType === 'SUNDAY')

  // 평일: 개별 요일들을 WEEKDAY 하나로 합침 (첫 번째 요일의 시간 사용)
  const firstWeekday = weekdayEntries[0]
  const weekdayForm: OperatingHourRequest = {
    dayType: 'WEEKDAY',
    isOperating: weekdayEntries.length > 0,
    openTime: firstWeekday?.openTime ?? null,
    closeTime: firstWeekday?.closeTime ?? null,
    breakStartTime: firstWeekday?.breakStartTime ?? null,
    breakEndTime: firstWeekday?.breakEndTime ?? null,
    selectWeekDayList: weekdayEntries.map((o) => o.dayType),
  }

  const saturdayForm: OperatingHourRequest = {
    dayType: 'SATURDAY',
    isOperating: saturday?.isOperating ?? false,
    openTime: saturday?.openTime ?? null,
    closeTime: saturday?.closeTime ?? null,
    breakStartTime: saturday?.breakStartTime ?? null,
    breakEndTime: saturday?.breakEndTime ?? null,
  }

  const sundayForm: OperatingHourRequest = {
    dayType: 'SUNDAY',
    isOperating: sunday?.isOperating ?? false,
    openTime: sunday?.openTime ?? null,
    closeTime: sunday?.closeTime ?? null,
    breakStartTime: sunday?.breakStartTime ?? null,
    breakEndTime: sunday?.breakEndTime ?? null,
  }

  return [weekdayForm, saturdayForm, sundayForm]
}

/**
 * 폼의 operating 배열을 서버 API 스펙에 맞게 변환
 *
 * 평일:
 * - 전체 요일(월~금) 선택 → dayType: "WEEKDAY" 1건
 * - 부분 선택 → 선택한 요일별 개별 dayType 각 1건
 * - 시간 미입력(null) → isOperating: false로 전송 (휴무 전환)
 *
 * 토/일:
 * - openTime + closeTime 모두 입력 → isOperating: true
 * - 시간 미입력(null) → isOperating: false로 전송 (휴무 전환)
 */
export function buildOperatingHoursRequest(
  operating: OperatingHourRequest[]
): OperatingHourRequest[] {
  const result: OperatingHourRequest[] = []

  const weekday = operating.find((o) => o.dayType === 'WEEKDAY')
  if (weekday) {
    const selected = weekday.selectWeekDayList ?? []
    const hasTime = !!(weekday.openTime && weekday.closeTime)
    const hasBreak = !!(weekday.breakStartTime && weekday.breakEndTime)

    const hourData = hasTime
      ? {
          isOperating: true,
          openTime: weekday.openTime,
          closeTime: weekday.closeTime,
          breakTimeEnabled: hasBreak,
          breakStartTime: hasBreak ? weekday.breakStartTime : null,
          breakEndTime: hasBreak ? weekday.breakEndTime : null,
        }
      : {
          isOperating: false,
          openTime: null,
          closeTime: null,
          breakTimeEnabled: false,
          breakStartTime: null,
          breakEndTime: null,
        }

    if (selected.length === 0) {
      if (hasTime) {
        console.warn('[store-utils] buildOperatingHoursRequest: 평일 요일이 선택되지 않아 영업시간이 요청에서 제외됩니다.')
      }
    } else if (selected.length === 5 && WEEKDAY_ORDER.every((d) => selected.includes(d))) {
      result.push({ ...hourData, dayType: 'WEEKDAY' })
    } else {
      for (const day of selected) {
        result.push({ ...hourData, dayType: day })
      }
    }
  }

  // 토요일 / 일요일
  for (const dayType of ['SATURDAY', 'SUNDAY'] as const) {
    const day = operating.find((o) => o.dayType === dayType)
    if (!day) continue

    const hasTime = !!(day.openTime && day.closeTime)
    const hasBreak = !!(day.breakStartTime && day.breakEndTime)

    if (hasTime) {
      result.push({
        dayType,
        isOperating: true,
        openTime: day.openTime,
        closeTime: day.closeTime,
        breakTimeEnabled: hasBreak,
        breakStartTime: hasBreak ? day.breakStartTime : null,
        breakEndTime: hasBreak ? day.breakEndTime : null,
      })
    } else {
      // 운영시간·휴게시간 모두 null → 휴무
      result.push({
        dayType,
        isOperating: false,
        openTime: null,
        closeTime: null,
        breakTimeEnabled: false,
        breakStartTime: null,
        breakEndTime: null,
      })
    }
  }

  return result
}
