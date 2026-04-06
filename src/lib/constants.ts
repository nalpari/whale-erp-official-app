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

/** 건강진단 만료일이 오늘 기준으로 경과했는지 판별 */
export const isHealthCheckExpired = (date?: string | null) => {
  if (!date) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [y, m, d] = date.split('-').map(Number)
  const expiry = new Date(y, m - 1, d)
  return expiry < today
}
