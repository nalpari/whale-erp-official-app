const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const

export const parseLocalDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const formatDate = (d: Date): string => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const formatDateShort = (dateStr: string) => {
  const d = parseLocalDate(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}(${DAY_NAMES[d.getDay()]})`
}

export const formatDateLabel = (dateStr: string) => {
  const d = parseLocalDate(dateStr)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const dayName = DAY_NAMES[d.getDay()]
  return `${d.getFullYear()}.${mm}.${dd} (${dayName})`
}

export const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

export const parseAmount = (value: string) => Number(value.replace(/[^\d]/g, '')) || 0

export const safeSessionGet = <T,>(key: string): T | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch (err) {
    console.warn(`[sessionStorage] "${key}" 파싱 실패:`, err)
    return null
  }
}

export const safeSessionSet = <T,>(key: string, value: T): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(`[sessionStorage] "${key}" 저장 실패:`, err)
  }
}

export const safeSessionRemove = (key: string): void => {
  try {
    sessionStorage.removeItem(key)
  } catch (err) {
    console.warn(`[sessionStorage] "${key}" 삭제 실패:`, err)
  }
}

/** 초과근무 항목에서 금액 요약을 계산한다. */
export const computeOvertimeSummary = (items: { actualPaymentAmount?: number; deductionAmount?: number; actualOvertimeHours?: number }[]) => {
  const totalPayment = items.reduce((sum, i) => sum + (i.actualPaymentAmount || 0), 0)
  const totalDeduction = items.reduce((sum, i) => sum + (i.deductionAmount || 0), 0)
  return {
    grossOvertimeAmount: totalPayment,
    totalDeductionAmount: totalDeduction,
    actualOvertimeAmount: totalPayment - totalDeduction,
    totalAmount: totalPayment - totalDeduction,
    totalWorkDays: items.length,
    totalOvertimeHours: items.reduce((sum, i) => sum + (i.actualOvertimeHours || 0), 0),
  }
}

/** sessionStorage의 preview 데이터에 수정된 항목을 반영한다. */
export const updateOvertimePreview = <T extends Record<string, unknown>>(
  previewKey: string,
  items: { actualPaymentAmount?: number; deductionAmount?: number; actualOvertimeHours?: number }[],
): void => {
  const data = safeSessionGet<T>(previewKey)
  if (!data) return
  const summary = computeOvertimeSummary(items)
  const updated = { ...data, details: items, ...summary }
  safeSessionSet(previewKey, updated)
}
