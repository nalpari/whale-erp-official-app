import type { WorkerResponse } from '@/types/schedule'

// ── 계약유형 스타일 매핑 ──

export function getContractStyle(contractType: string) {
  switch (contractType) {
    case '파트타이머':
      return { boxClass: 'part', badgeClass: 'badge green', label: '파트' }
    case '임시근무':
      return { boxClass: 'temporary', badgeClass: 'badge brown', label: '임시' }
    default:
      return { boxClass: 'full', badgeClass: 'badge blue', label: contractType }
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

const CONTRACT_ORDER: Record<string, number> = {
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

export function formatDateWithDay(dateStr: string): string {
  const date = new Date(dateStr)
  return `${dateStr.replace(/-/g, '.')} ${DAY_LABELS[date.getDay()]}`
}

// ── 날짜 유틸 ──

export function getMonday(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().slice(0, 10)
}

export function getSunday(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? 0 : 7)
  d.setDate(diff)
  return d.toISOString().slice(0, 10)
}
