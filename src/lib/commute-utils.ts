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

/**
 * 출퇴근 기록 단건에 대한 일별 표시 상태 계산
 * Description #7, #10 기준
 */
export function getAttendanceDayStatus(
  record: AttendanceRecord,
  now: Date = new Date(),
): CommuteDayDisplayStatus {
  if (record.isHoliday) return '휴일'

  const recordDate = new Date(record.date)
  const isToday =
    recordDate.getFullYear() === now.getFullYear() &&
    recordDate.getMonth() === now.getMonth() &&
    recordDate.getDate() === now.getDate()
  const isPast = recordDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // 출근 기록 없음
  if (record.recordId === null) {
    if (isPast) return '결근'
    // 오늘: 계약 출근 시간이 지났으면 미출근
    if (isToday && record.contractStartTime) {
      const contractStartMin = timeToMinutes(record.contractStartTime)
      const nowMin = now.getHours() * 60 + now.getMinutes()
      if (nowMin >= contractStartMin) return '미출근'
    }
    return '미출근'
  }

  // 출근은 했고 퇴근 미등록
  if (record.workStartTime && !record.workEndTime) {
    if (record.contractEndTime) {
      const contractEndMin = timeToMinutes(record.contractEndTime)
      const nowMin = now.getHours() * 60 + now.getMinutes()
      if (isToday && nowMin >= contractEndMin + 30) return '지연'
    }
    return '근무'
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
  return Array.from(map.values())
}

/**
 * 출퇴근 시작/종료 시간으로 근무 분 계산
 * - 퇴근 없으면 24:00 기준
 * - 출근 없으면 00:00 기준
 */
export function calcWorkMinutes(
  workStartTime: string | null,
  workEndTime: string | null,
): number {
  const startMin = workStartTime ? timeToMinutes(workStartTime) : 0
  const endMin = workEndTime ? timeToMinutes(workEndTime) : 24 * 60
  return Math.max(0, endMin - startMin)
}
