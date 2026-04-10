import type { AttendanceRecord, CommuteDayDisplayStatus } from '@/types/commute'

export interface AttendanceRecordGroup {
  date: string
  day: string
  isHoliday: boolean
  hasContract: boolean  // contractStartTime/contractEndTime 둘 다 null이면 false
  records: AttendanceRecord[]
  totalMinutes: number
  status: CommuteDayDisplayStatus
}

/** HH:mm:ss 문자열을 분 단위로 변환 */
export function timeToMinutes(time: string): number {
  const [h, m, s] = time.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) {
    console.warn('[timeToMinutes] 잘못된 시간 형식:', time)
    return 0
  }
  return h * 60 + (m ?? 0) + ((s ?? 0) / 60)
}

/** 분 단위를 "Xh Ym" 형태로 포맷 */
export function formatMinutes(minutes: number): string {
  if (minutes <= 0) return '0분'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}분`
  if (m === 0) return `${h}시간`
  return `${h}시간 ${m}분`
}

/** HH:mm:ss → HH:mm 포맷 */
export function formatTime(time: string | null): string {
  if (!time) return ''
  return time.slice(0, 5)
}

/** Date 객체를 로컬 날짜 기준 YYYY-MM-DD 문자열로 변환 (toISOString은 UTC 기준이므로 사용 금지) */
export function toInputDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const AVATAR_MAP: Record<number, string> = {
  0: '/assets/images/layout/avatar01.svg',
  1: '/assets/images/layout/avatar02.svg',
  2: '/assets/images/layout/avatar03.svg',
  3: '/assets/images/layout/avatar04.svg',
}

export function getAvatarSrc(iconType: number): string {
  return AVATAR_MAP[iconType] ?? AVATAR_MAP[0]
}

/**
 * 출퇴근 기록 단건에 대한 일별 표시 상태 계산
 *
 * 1. 휴일이고 실제 근무 기록(출근·퇴근 모두)이 없으면 → '휴일'
 * 2. workStartTime 또는 workEndTime이 하나라도 있으면 → '근무'
 *    (자정 넘김 퇴근일: workEndTime만 있는 경우도 '근무')
 * 3. 그 외 → '결근'
 */
export function getAttendanceDayStatus(
  record: AttendanceRecord,
): CommuteDayDisplayStatus {
  if (record.isHoliday && !record.workStartTime && !record.workEndTime) return '휴일'
  if (record.workStartTime || record.workEndTime) return '근무'
  return '결근'
}

/**
 * 날짜별로 근무 기록을 그룹화하고 일별 총 근무시간을 합산한다
 */
export function groupAttendanceRecords(
  records: AttendanceRecord[],
): AttendanceRecordGroup[] {
  const map = new Map<string, AttendanceRecordGroup>()
  for (const record of records) {
    const existing = map.get(record.date)
    if (existing) {
      existing.records.push(record)
      existing.totalMinutes += calcWorkMinutes(record.workStartTime, record.workEndTime)
    } else {
      map.set(record.date, {
        date: record.date,
        day: record.day,
        isHoliday: record.isHoliday,
        hasContract: !(record.contractStartTime === null && record.contractEndTime === null),
        records: [record],
        totalMinutes: calcWorkMinutes(record.workStartTime, record.workEndTime),
        status: getAttendanceDayStatus(record),
      })
    }
  }
  // 같은 날 레코드가 2개 이상인 경우 전체 레코드 기반으로 status 재계산
  for (const group of map.values()) {
    if (group.records.length > 1) {
      const statuses = group.records.map((r) => getAttendanceDayStatus(r))
      // 우선순위: 휴일 > 결근 > 근무 (row별 개별 표시가 기본이므로 그룹 상태는 참고용)
      if (statuses.includes('휴일')) group.status = '휴일'
      else if (statuses.includes('결근')) group.status = '결근'
      else group.status = '근무'
    }
  }
  return Array.from(map.values())
}

const MIDNIGHT_START = '00:00'
const DAY_END = '23:59'

export interface DisplayTimeRange {
  startTime: string   // 'HH:mm' 형식
  endTime: string     // 'HH:mm' 형식 또는 '진행 중'
  inProgress: boolean // 오늘 출근 후 아직 퇴근하지 않은 상태
}

/**
 * 레코드의 표시용 시간 범위를 계산한다.
 * - 출근·퇴근 모두 있음 → 정상 표시
 * - 출근만 있고 퇴근 없음 (과거) → 'HH:mm ~ 23:59' (자정 넘김 또는 미퇴근)
 * - 출근만 있고 퇴근 없음 (오늘) → 'HH:mm ~ 진행 중'
 * - 퇴근만 있고 출근 없음 → '00:00 ~ HH:mm' (자정 넘김 퇴근일)
 */
export function getDisplayTimeRange(
  record: AttendanceRecord,
): DisplayTimeRange | null {
  const { workStartTime, workEndTime } = record

  // 둘 다 있음 → 정상 표시
  if (workStartTime && workEndTime) {
    return { startTime: formatTime(workStartTime), endTime: formatTime(workEndTime), inProgress: false }
  }

  // 출근만 있고 퇴근 없음 → 과거면 자정 경계, 오늘이면 진행 중
  if (workStartTime && !workEndTime) {
    const [year, month, day] = record.date.split('-').map(Number)
    const recordDate = new Date(year, month - 1, day)
    const now = new Date()
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const isPast = recordDate < todayMidnight

    if (isPast) {
      return { startTime: formatTime(workStartTime), endTime: DAY_END, inProgress: false }
    }
    return { startTime: formatTime(workStartTime), endTime: '진행 중', inProgress: true }
  }

  // 퇴근만 있고 출근 없음 → 자정 넘김 퇴근일
  if (!workStartTime && workEndTime) {
    return { startTime: MIDNIGHT_START, endTime: formatTime(workEndTime), inProgress: false }
  }

  // 둘 다 없음
  return null
}

/**
 * 출퇴근 시작/종료 시간으로 근무 분 계산
 * - 출근 또는 퇴근이 없으면 0 반환 (진행 중이거나 결근인 경우)
 * - 야간 근무(자정 넘기기) 지원
 */
export function calcWorkMinutes(
  workStartTime: string | null,
  workEndTime: string | null,
): number {
  if (!workStartTime || !workEndTime) return 0
  const startMin = timeToMinutes(workStartTime)
  let endMin = timeToMinutes(workEndTime)
  if (endMin < startMin) endMin += 24 * 60 // 야간 근무 (자정 넘기기)
  return Math.max(0, endMin - startMin)
}
