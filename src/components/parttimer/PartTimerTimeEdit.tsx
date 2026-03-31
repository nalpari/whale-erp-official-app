'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUpdatePartTimerPayroll } from '@/hooks/queries/use-parttime-payroll-queries'
import { getErrorMessage } from '@/lib/api'
import type { PartTimerPayrollDetail, PartTimerPaymentItem } from '@/types/parttime-payroll'

interface PartTimerTimeEditProps {
  payrollId: number
  initialData?: PartTimerPayrollDetail
}

const DEDUCTION_RATE = 0.033

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

const parseAmount = (value: string) => Number(value.replace(/[^\d]/g, '')) || 0

// 0.5시간 단위 옵션 (0~24)
const HOUR_OPTIONS = Array.from({ length: 49 }, (_, i) => i * 0.5)

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

const formatDateLabel = (dateStr: string) => {
  const d = new Date(dateStr)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const dayName = DAY_NAMES[d.getDay()]
  return `${d.getFullYear()}.${mm}.${dd} (${dayName})`
}

// 정산기간 내 날짜 목록 생성
const generateDates = (startDate: string, endDate: string): string[] => {
  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  const current = new Date(start)
  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export default function PartTimerTimeEdit({ payrollId, initialData }: PartTimerTimeEditProps) {
  const router = useRouter()
  const updateMutation = useUpdatePartTimerPayroll()

  const contractTimelyAmount = initialData?.paymentItems?.[0]?.contractTimelyAmount ?? 0

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
      // 지급액 자동 계산
      item.totalAmount = Math.round(item.workHour * item.applyTimelyAmount)
      // 3.3% 공제 자동 계산
      item.deductionAmount = Math.round(item.totalAmount * DEDUCTION_RATE)
      updated[index] = item
      return updated
    })
  }

  const handleApplyContractWage = () => {
    setItems((prev) =>
      prev.map((item) => {
        const updated = { ...item, applyTimelyAmount: contractTimelyAmount }
        updated.totalAmount = Math.round(updated.workHour * updated.applyTimelyAmount)
        updated.deductionAmount = Math.round(updated.totalAmount * DEDUCTION_RATE)
        return updated
      }),
    )
  }

  const handleSave = async () => {
    if (!initialData) return

    // 근무시간이 0보다 큰 항목만 전송
    const paymentItems = items.filter((item) => item.workHour > 0)

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
                      계약 시간 적용 ({formatAmount(contractTimelyAmount)}원)
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
