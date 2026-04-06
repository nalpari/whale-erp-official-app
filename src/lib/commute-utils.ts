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
  const [h, m] = time.split(':').map(Number)
  return h * 60 + (m ?? 0)
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
 * 화면정의서 Note #7: 지연 = 계약 출근 시각 기준 30분 초과 출근
 * 화면정의서 Note #10: 출근기록 있으면 계약 없어도 근무로 표시
 */
export function getAttendanceDayStatus(
  record: AttendanceRecord,
  now: Date = new Date(),
): CommuteDayDisplayStatus {
  if (record.isHoliday) return '휴일'

  // "YYYY-MM-DD" 문자열을 UTC가 아닌 로컬 자정으로 파싱 (new Date("YYYY-MM-DD")는 UTC midnight)
  const [year, month, day] = record.date.split('-').map(Number)
  const recordDate = new Date(year, month - 1, day)
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const isPast = recordDate < todayMidnight

  // 출근 기록 없음
  if (record.recordId === null) {
    if (isPast) return '결근'
    return '미출근'
  }

  // 출근 기록 있음 — 지연 판단: 계약 출근 시각 기준 30분 초과 시 지연 (화면정의서 Note #7)
  if (record.workStartTime && record.contractStartTime) {
    const contractStartMin = timeToMinutes(record.contractStartTime)
    const workStartMin = timeToMinutes(record.workStartTime)
    if (workStartMin > contractStartMin + 30) return '지연'
  }

  return '근무'
}

/**
 * 날짜별로 근무 기록을 그룹화하고 일별 총 근무시간을 합산한다
 */
export function groupAttendanceRecords(
  records: AttendanceRecord[],
  now: Date = new Date(),
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
        status: getAttendanceDayStatus(record, now),
      })
    }
  }
  // 같은 날 레코드가 2개 이상인 경우 전체 레코드 기반으로 status 재계산
  // (최초 그룹 생성 시 첫 번째 레코드만 사용하던 버그 수정)
  for (const group of map.values()) {
    if (group.records.length > 1) {
      const statuses = group.records.map((r) => getAttendanceDayStatus(r, now))
      if (statuses.includes('휴일')) group.status = '휴일'
      else if (statuses.includes('지연')) group.status = '지연'
      else if (statuses.includes('근무')) group.status = '근무'
      else if (statuses.includes('미출근')) group.status = '미출근'
      else if (statuses.includes('결근')) group.status = '결근'
    }
  }
  return Array.from(map.values())
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
