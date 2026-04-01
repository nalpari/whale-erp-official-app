'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUpdatePartTimerPayroll } from '@/hooks/queries/use-parttime-payroll-queries'
import { getErrorMessage } from '@/lib/api'
import type { PartTimerPayrollDetail, PartTimerPaymentItem } from '@/types/parttime-payroll'
import type { ContractWorkHour, ContractSalaryInfo, DayType } from '@/types/contract'

interface PartTimerTimeEditProps {
  payrollId?: number
  initialData?: PartTimerPayrollDetail
  isPreview?: boolean
  onPreviewSave?: (items: PartTimerPaymentItem[]) => void
  contractWage?: number
  contractWorkHours?: ContractWorkHour[]
  contractSalaryInfo?: ContractSalaryInfo
}

const DEDUCTION_RATE = 0.033

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

const parseAmount = (value: string) => Number(value.replace(/[^\d]/g, '')) || 0

// 0.5시간 단위 옵션 (0~24)
const HOUR_OPTIONS = Array.from({ length: 49 }, (_, i) => i * 0.5)

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

// YYYY-MM-DD 문자열을 로컬 Date로 파싱 (UTC 타임존 이슈 방지)
const parseLocalDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const formatDate = (d: Date): string => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const formatDateLabel = (dateStr: string) => {
  const d = parseLocalDate(dateStr)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const dayName = DAY_NAMES[d.getDay()]
  return `${d.getFullYear()}.${mm}.${dd} (${dayName})`
}

// JS Date.getDay() → DayType 매핑 (0=일, 1=월, ...)
const JS_DAY_TO_DAY_TYPE: DayType[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

// "HH:mm" 형식 시간을 시간 단위(소수)로 변환
const parseTimeToHours = (time?: string): number => {
  if (!time) return 0
  const [h, m] = time.split(':').map(Number)
  return h + (m || 0) / 60
}

// 요일에 해당하는 ContractWorkHour 찾기 (개별 요일 → WEEKDAY/WEEKEND fallback)
const findWorkHourForDay = (dayType: DayType, workHours: ContractWorkHour[]): ContractWorkHour | undefined => {
  const exact = workHours.find((w) => w.dayType === dayType)
  if (exact) return exact
  const isWeekend = dayType === 'SATURDAY' || dayType === 'SUNDAY'
  return workHours.find((w) => w.dayType === (isWeekend ? 'WEEKEND' : 'WEEKDAY'))
}

// 정산기간 내 날짜 목록 생성
const generateDates = (startDate: string, endDate: string): string[] => {
  const dates: string[] = []
  const start = parseLocalDate(startDate)
  const end = parseLocalDate(endDate)
  const current = new Date(start)
  while (current <= end) {
    dates.push(formatDate(current))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export default function PartTimerTimeEdit({ payrollId, initialData, isPreview = false, onPreviewSave, contractWage, contractWorkHours, contractSalaryInfo }: PartTimerTimeEditProps) {
  const router = useRouter()
  const updateMutation = useUpdatePartTimerPayroll()

  // 등록: 근로계약서 시급(contractWage) 또는 API 응답 시급 사용, 수정: 기존 저장된 시급 사용
  const contractTimelyAmount = contractWage
    ?? initialData?.paymentItems?.[0]?.contractTimelyAmount
    ?? initialData?.paymentItems?.[0]?.applyTimelyAmount
    ?? 0

  // 정산기간 내 모든 날짜를 기반으로 편집 상태 초기화
  const allDates = initialData
    ? generateDates(initialData.settlementStartDate, initialData.settlementEndDate)
    : []

  const [items, setItems] = useState<PartTimerPaymentItem[]>(() => {
    const existingMap = new Map(
      (initialData?.paymentItems ?? []).map((item) => [item.workDay, item]),
    )
    return allDates.map((date) => {
      const existing = existingMap.get(date)
      return existing ?? {
        workDay: date,
        workHour: 0,
        breakTimeHour: 0,
        contractTimelyAmount,
        applyTimelyAmount: contractTimelyAmount,
        totalAmount: 0,
        deductionAmount: 0,
      }
    })
  })

  const updateItem = (index: number, updates: Partial<PartTimerPaymentItem>) => {
    setItems((prev) => {
      const updated = [...prev]
      const item = { ...updated[index], ...updates }
      // 지급액 자동 계산 (총근무시간 - 휴게시간)
      const netWorkHour = Math.max(item.workHour - item.breakTimeHour, 0)
      item.totalAmount = Math.round(netWorkHour * item.applyTimelyAmount)
      // 3.3% 공제 자동 계산
      item.deductionAmount = Math.round(item.totalAmount * DEDUCTION_RATE)
      updated[index] = item
      return updated
    })
  }

  const handleApplyContractWage = () => {
    // 등록 모드: workHours 기반으로 요일별 근무시간/시급 자동 채움
    if (contractWorkHours && contractWorkHours.length > 0) {
      const salary = contractSalaryInfo
      setItems((prev) =>
        prev.map((item) => {
          const d = parseLocalDate(item.workDay)
          const dayType = JS_DAY_TO_DAY_TYPE[d.getDay()]
          const wh = findWorkHourForDay(dayType, contractWorkHours)

          if (!wh || !wh.isWork) {
            // 비근무일: 0으로 초기화
            return { ...item, workHour: 0, breakTimeHour: 0, applyTimelyAmount: contractTimelyAmount, contractTimelyAmount, totalAmount: 0, deductionAmount: 0 }
          }

          const workHour = parseTimeToHours(wh.workEndTime) - parseTimeToHours(wh.workStartTime)
          const breakTimeHour = wh.isBreak ? parseTimeToHours(wh.breakEndTime) - parseTimeToHours(wh.breakStartTime) : 0
          const netWorkHour = Math.max(workHour - breakTimeHour, 0)

          // 시급 결정: 주말이면 휴일시급, 평일이면 계약시급
          const isWeekend = dayType === 'SATURDAY' || dayType === 'SUNDAY'
          const applyAmount = isWeekend
            ? (salary?.holidayAllowanceTimeAmount ?? salary?.timelySalary ?? contractTimelyAmount)
            : (salary?.timelySalary ?? contractTimelyAmount)

          const totalAmount = Math.round(netWorkHour * applyAmount)
          const deductionAmount = Math.round(totalAmount * DEDUCTION_RATE)

          return {
            ...item,
            workHour: workHour,
            breakTimeHour,
            contractTimelyAmount: salary?.timelySalary ?? contractTimelyAmount,
            applyTimelyAmount: applyAmount,
            totalAmount,
            deductionAmount,
          }
        }),
      )
      return
    }

    // 수정 모드: 불러온 원본 데이터로 초기화
    const existingMap = new Map(
      (initialData?.paymentItems ?? []).map((item) => [item.workDay, item]),
    )
    setItems((prev) =>
      prev.map((item) => {
        const original = existingMap.get(item.workDay)
        return original ?? { ...item, workHour: 0, breakTimeHour: 0, totalAmount: 0, deductionAmount: 0 }
      }),
    )
  }

  const handleSave = async () => {
    if (!initialData) return

    // 근무시간이 0보다 큰 항목만 전송
    const paymentItems = items.filter((item) => item.workHour > 0)

    if (isPreview && onPreviewSave) {
      onPreviewSave(paymentItems)
      router.back()
      return
    }

    if (!payrollId) return

    try {
      await updateMutation.mutateAsync({
        id: payrollId,
        data: {
          payrollYearMonth: initialData.payrollYearMonth,
          settlementStartDate: initialData.settlementStartDate,
          settlementEndDate: initialData.settlementEndDate,
          paymentDate: initialData.paymentDate,
          paymentItems,
          deductionItems: initialData.deductionItems.length > 0 ? initialData.deductionItems : undefined,
          remarks: initialData.remarks || undefined,
        },
      })
      alert('근무시간이 저장되었습니다.')
      router.push(`/parttimer/${payrollId}`)
    } catch (error) {
      alert(getErrorMessage(error, '저장에 실패했습니다.'))
    }
  }

  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="block mb15">
                    <div className="s-txt">근무 시간을 입력하지 않을 경우 해당 날짜는 출근하지 않은 날짜로 인식합니다.</div>
                    <div className="s-txt">총근무시간은 출근시간에서 퇴근시간까지의 모든 시간을 입력하세요.</div>
                    <div className="s-txt">휴게시간은 총근무시간에서 제외하고 급여명세서에 표시됩니다.</div>
                  </div>
                  <div className="block mb10">
                    <input
                      type="text"
                      className="input-frame"
                      readOnly
                      value={initialData?.memberName ?? ''}
                    />
                  </div>
                  <div className="block">
                    <button className="btn-form block grey" onClick={handleApplyContractWage}>
                      계약 시간 적용
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {items.map((item, index) => (
            <div className="sub-cont-wrap" key={item.workDay}>
              <div className="sub-cont-item-wrap">
                <div className="sub-cont-tit-wrap">
                  <div className="sub-cont-tit s">{formatDateLabel(item.workDay)}</div>
                </div>
                <div className="sub-item-bx">
                  <div className="work-time-info">
                    <div className="work-time-info-item">
                      <div className="badge d-green">근무시간</div>
                      <div className="work-time-info-val">
                        {item.workHour > 0 ? `${item.workHour}시간` : '-'}
                      </div>
                    </div>
                    <div className="work-time-info-item">
                      <div className="badge d-red">지급액</div>
                      <div className="work-time-info-val">
                        {item.totalAmount > 0 ? `${formatAmount(item.totalAmount)}원` : '-'}
                      </div>
                    </div>
                  </div>
                  <div className="work-time-data-wrap">
                    <div className="work-time-data-item">
                      <div className="work-time-data-item-tit">총근무시간</div>
                      <div className="block">
                        <select
                          className="select-form"
                          value={item.workHour}
                          onChange={(e) => updateItem(index, { workHour: Number(e.target.value) })}
                        >
                          {HOUR_OPTIONS.map((h) => (
                            <option key={h} value={h}>{h}시간</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="work-time-data-item">
                      <div className="work-time-data-item-tit">휴게시간</div>
                      <div className="block">
                        <select
                          className="select-form"
                          value={item.breakTimeHour}
                          onChange={(e) => updateItem(index, { breakTimeHour: Number(e.target.value) })}
                        >
                          {HOUR_OPTIONS.filter((h) => h <= 4).map((h) => (
                            <option key={h} value={h}>{h}시간</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="work-time-data-item">
                      <div className="work-time-data-item-tit">적용시급</div>
                      <div className="block">
                        <input
                          type="text"
                          className="input-frame al-r"
                          inputMode="numeric"
                          value={item.applyTimelyAmount ? formatAmount(item.applyTimelyAmount) : ''}
                          onChange={(e) => updateItem(index, { applyTimelyAmount: parseAmount(e.target.value) })}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="content-pagination">
        <button
          className="btn-form block blue"
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? '저장 중...' : '저장하기'}
        </button>
      </div>
    </>
  )
}
