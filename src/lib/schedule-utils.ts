import type { WorkerResponse, ScheduleContractType } from '@/types/schedule'

// ── 아바타 아이콘 매핑 ──
// index 0(기본)과 1은 동일 이미지 — iconType 서버 값(0~3)과 1:1 매핑
const AVATAR_IMAGES = [
  '/assets/images/layout/avatar01.svg',
  '/assets/images/layout/avatar01.svg',
  '/assets/images/layout/avatar02.svg',
  '/assets/images/layout/avatar03.svg',
] as const

/** iconType(0~3) → 아바타 이미지 경로 */
export function getWorkerAvatar(iconType: number): string {
  return AVATAR_IMAGES[iconType] ?? AVATAR_IMAGES[0]
}

// ── 계약유형 스타일 매핑 ──

export function getContractStyle(contractType: ScheduleContractType) {
  switch (contractType) {
    case '파트타이머':
      return { wrapClass: 'part', badgeClass: 'badge green', label: '파트' }
    case '임시근무':
      return { wrapClass: 'temporary', badgeClass: 'badge brown', label: '임시' }
    default:
      return { wrapClass: 'full', badgeClass: 'badge blue', label: contractType }
  }
}

// ── 근무시간 계산 ──

export function calcWorkHours(worker: Pick<WorkerResponse, 'hasWork' | 'workStartTime' | 'workEndTime' | 'hasBreak' | 'breakStartTime' | 'breakEndTime'>): string {
  if (!worker.hasWork || !worker.workStartTime || !worker.workEndTime) return '0h'
  const [sh, sm] = worker.workStartTime.split(':').map(Number)
  const [eh, em] = worker.workEndTime.split(':').map(Number)
  let totalMin = (eh * 60 + em) - (sh * 60 + sm)
  if (totalMin < 0) totalMin += 24 * 60
  if (worker.hasBreak && worker.breakStartTime && worker.breakEndTime) {
    const [bsh, bsm] = worker.breakStartTime.split(':').map(Number)
    const [beh, bem] = worker.breakEndTime.split(':').map(Number)
    let breakMin = (beh * 60 + bem) - (bsh * 60 + bsm)
    if (breakMin < 0) breakMin += 24 * 60
    totalMin -= breakMin
  }
  const hours = Math.floor(totalMin / 60)
  const mins = totalMin % 60
  return mins > 0 ? `${hours}h${mins}m` : `${hours}h`
}

// ── 정렬 ──

const CONTRACT_ORDER: Record<ScheduleContractType, number> = {
  '정직원': 1, '계약직': 2, '수습': 3, '파트타이머': 4, '임시근무': 5,
}

export function sortWorkers<T extends Pick<WorkerResponse, 'workStartTime' | 'contractType' | 'isDeleted'>>(workers: T[]): T[] {
  return [...workers]
    .filter((w) => !w.isDeleted)
    .sort((a, b) => {
      const timeA = a.workStartTime ?? '99:99'
      const timeB = b.workStartTime ?? '99:99'
      if (timeA !== timeB) return timeA.localeCompare(timeB)
      return (CONTRACT_ORDER[a.contractType] ?? 99) - (CONTRACT_ORDER[b.contractType] ?? 99)
    })
}

// ── 요일 ──

export const DAY_OPTIONS = [
  { value: 'MONDAY', label: '월' },
  { value: 'TUESDAY', label: '화' },
  { value: 'WEDNESDAY', label: '수' },
  { value: 'THURSDAY', label: '목' },
  { value: 'FRIDAY', label: '금' },
  { value: 'SATURDAY', label: '토' },
  { value: 'SUNDAY', label: '일' },
] as const

export const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const

/** YYYY-MM-DD 문자열을 로컬 타임존 Date로 파싱 (UTC 오프셋 버그 방지) */
export function parseDateLocal(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDateWithDay(dateStr: string): string {
  const date = parseDateLocal(dateStr)
  return `${dateStr.replace(/-/g, '.')} ${DAY_LABELS[date.getDay()]}`
}

// ── 날짜 유틸 ──

function formatLocalDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export function getMonday(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return formatLocalDate(d)
}

export function getSunday(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? 0 : 7)
  d.setDate(diff)
  return formatLocalDate(d)
}
