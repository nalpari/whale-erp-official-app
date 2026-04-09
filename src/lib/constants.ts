// TODO: 요금제 페이지 경로가 맞는지 확인 필요
export const EXTERNAL_URLS = {
  RATE_PLAN: "https://www.whaleerp.co.kr/customer/rate-plan",
} as const

export const OWNER_CODE = {
  HEAD_OFFICE: "PRGRP_002_001",
  FRANCHISE: "PRGRP_002_002",
} as const

/** 수당 배율 상수 */
export const OVERTIME_RATE = 1.5
export const NIGHT_RATE = 0.5
export const HOLIDAY_RATE = 1.5
export const ADD_HOLIDAY_RATE = 2.0

/** 금액을 한국 원화 형식으로 포맷 (예: 1,234,567) */
export const formatAmount = (val: number) => val.toLocaleString('ko-KR')

/** 전자계약 상태 배지 매핑 */
export const CONTRACT_STATUS_BADGE: Record<string, { label: string; className: string }> = {
  WRITING: { label: '작성중', className: 'badge blue' },
  PROGRESS: { label: '진행중', className: 'badge green' },
  COMPLETE: { label: '계약완료', className: 'badge org' },
  REFUSAL: { label: '거부', className: 'badge red' },
}

/** 계약상태 옵션 목록 (검색 필터 등에서 사용) */
export const CONTRACT_STATUS_OPTIONS = [
  { value: 'WRITING', label: '작성중' },
  { value: 'PROGRESS', label: '진행중' },
  { value: 'COMPLETE', label: '계약완료' },
  { value: 'REFUSAL', label: '거부' },
] as const


/** 건강진단 만료일이 오늘 기준으로 경과했는지 판별 */
export const isHealthCheckExpired = (date?: string | null) => {
  if (!date) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [y, m, d] = date.split('-').map(Number)
  const expiry = new Date(y, m - 1, d)
  return expiry < today
}
