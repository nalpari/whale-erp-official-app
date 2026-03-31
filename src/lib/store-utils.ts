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

const ALL_WEEKDAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']

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
  return officeId!
}

/**
 * 서버 응답의 개별 요일 데이터를 폼의 WEEKDAY/SATURDAY/SUNDAY 구조로 역변환
 *
 * 서버는 WEEKDAY를 MONDAY~FRIDAY 개별로 확장 저장하므로,
 * 조회 시 개별 요일로 내려온 데이터를 폼에서 사용하는 WEEKDAY 구조로 합쳐야 함
 */
export function toFormOperating(serverOperating: OperatingHour[]): OperatingHourRequest[] {
  const weekdayEntries = serverOperating.filter((o) =>
    ALL_WEEKDAYS.includes(o.dayType) && o.isOperating
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
    isOperating: saturday?.isOperating ?? true,
    openTime: saturday?.openTime ?? null,
    closeTime: saturday?.closeTime ?? null,
    breakStartTime: saturday?.breakStartTime ?? null,
    breakEndTime: saturday?.breakEndTime ?? null,
  }

  const sundayForm: OperatingHourRequest = {
    dayType: 'SUNDAY',
    isOperating: sunday?.isOperating ?? true,
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
 *
 * 토/일:
 * - openTime + closeTime 모두 입력된 경우에만 포함
 * - 미입력 시 요청에서 제외
 */
export function buildOperatingHoursRequest(
  operating: OperatingHourRequest[]
): OperatingHourRequest[] {
  const result: OperatingHourRequest[] = []

  const weekday = operating.find((o) => o.dayType === 'WEEKDAY')
  if (weekday && weekday.openTime && weekday.closeTime) {
    const selected = weekday.selectWeekDayList ?? []
    const hasBreak = !!(weekday.breakStartTime && weekday.breakEndTime)

    const baseHour = {
      isOperating: true,
      openTime: weekday.openTime,
      closeTime: weekday.closeTime,
      breakTimeEnabled: hasBreak,
      breakStartTime: hasBreak ? weekday.breakStartTime : null,
      breakEndTime: hasBreak ? weekday.breakEndTime : null,
    }

    // 전체 선택 → WEEKDAY
    if (selected.length === 5 && ALL_WEEKDAYS.every((d) => selected.includes(d))) {
      result.push({ ...baseHour, dayType: 'WEEKDAY' })
    } else if (selected.length > 0) {
      // 부분 선택 → 개별 요일
      for (const day of selected) {
        result.push({ ...baseHour, dayType: day })
      }
    }
  }

  // 토요일
  // TODO: 서버가 isOperating: false를 명시적으로 요구하는지 확인 필요 (현재는 미입력 시 미전송)
  const saturday = operating.find((o) => o.dayType === 'SATURDAY')
  if (saturday && saturday.openTime && saturday.closeTime) {
    const hasBreak = !!(saturday.breakStartTime && saturday.breakEndTime)
    result.push({
      dayType: 'SATURDAY',
      isOperating: true,
      openTime: saturday.openTime,
      closeTime: saturday.closeTime,
      breakTimeEnabled: hasBreak,
      breakStartTime: hasBreak ? saturday.breakStartTime : null,
      breakEndTime: hasBreak ? saturday.breakEndTime : null,
    })
  }

  // 일요일
  const sunday = operating.find((o) => o.dayType === 'SUNDAY')
  if (sunday && sunday.openTime && sunday.closeTime) {
    const hasBreak = !!(sunday.breakStartTime && sunday.breakEndTime)
    result.push({
      dayType: 'SUNDAY',
      isOperating: true,
      openTime: sunday.openTime,
      closeTime: sunday.closeTime,
      breakTimeEnabled: hasBreak,
      breakStartTime: hasBreak ? sunday.breakStartTime : null,
      breakEndTime: hasBreak ? sunday.breakEndTime : null,
    })
  }

  return result
}
