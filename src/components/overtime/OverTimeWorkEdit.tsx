'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUpdateOvertime } from '@/hooks/queries/use-overtime-queries'
import { getErrorMessage } from '@/lib/api'
import type { OvertimeAllowanceDetail, OvertimeAllowanceItemDto } from '@/types/overtime'

interface OverTimeWorkEditProps {
  overtimeId?: number
  initialData?: OvertimeAllowanceDetail
  isPreview?: boolean
  onPreviewSave?: (items: OvertimeAllowanceItemDto[]) => void
}

const DEDUCTION_RATE = 0.033
const OVERTIME_WAGE_MULTIPLIER = 1.5

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

const parseAmount = (value: string) => Number(value.replace(/[^\d]/g, '')) || 0

// 0.5시간 단위 옵션 (0~24)
const HOUR_OPTIONS = Array.from({ length: 49 }, (_, i) => i * 0.5)

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

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

// 시간 옵션 (00:00 ~ 23:30, 30분 단위)
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0')
  const m = i % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

// 기간 내 날짜 목록 생성
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

export default function OverTimeWorkEdit({ overtimeId, initialData, isPreview = false, onPreviewSave }: OverTimeWorkEditProps) {
  const router = useRouter()
  const { mutateAsync: updateOvertime, isPending: isUpdating } = useUpdateOvertime()

  const contractTimelyAmount = initialData?.details?.[0]?.contractTimelyAmount ?? 0

  // 기간 내 모든 날짜를 기반으로 편집 상태 초기화
  const allDates = initialData
    ? generateDates(initialData.calculationStartDate, initialData.calculationEndDate)
    : []

  const [items, setItems] = useState<OvertimeAllowanceItemDto[]>(() => {
    const existingMap = new Map(
      (initialData?.details ?? []).map((item) => [item.workDay, item]),
    )
    return allDates.map((date) => {
      const existing = existingMap.get(date)
      return existing ?? {
        workDay: date,
        workHour: 0,
        breakTimeHour: 0,
        contractTimelyAmount,
        applyTimelyAmount: Math.round(contractTimelyAmount * OVERTIME_WAGE_MULTIPLIER),
        expectedOvertimeHours: 0,
        actualOvertimeHours: 0,
        deductionAmount: 0,
        actualPaymentAmount: 0,
      }
    })
  })

  const updateItem = (index: number, updates: Partial<OvertimeAllowanceItemDto>) => {
    setItems((prev) => {
      const updated = [...prev]
      const item = { ...updated[index], ...updates }
      // 실제 연장근무시간 = 총근무시간 - 휴게시간
      const netHours = Math.max((item.workHour || 0) - (item.breakTimeHour || 0), 0)
      item.actualOvertimeHours = netHours
      // 지급액 = 실제연장근무시간 × 적용시급
      item.actualPaymentAmount = Math.round(netHours * (item.applyTimelyAmount || 0))
      // 공제액 = 지급액 × 3.3%
      item.deductionAmount = Math.round(item.actualPaymentAmount * DEDUCTION_RATE)
      updated[index] = item
      return updated
    })
  }

  // 계약시급 × 1.5 적용
  const handleApplyContractWage = () => {
    if (!contractTimelyAmount) return
    const overtimeWage = Math.round(contractTimelyAmount * OVERTIME_WAGE_MULTIPLIER)
    setItems((prev) =>
      prev.map((item) => {
        const netHours = Math.max((item.workHour || 0) - (item.breakTimeHour || 0), 0)
        const payment = Math.round(netHours * overtimeWage)
        return {
          ...item,
          applyTimelyAmount: overtimeWage,
          actualOvertimeHours: netHours,
          actualPaymentAmount: payment,
          deductionAmount: Math.round(payment * DEDUCTION_RATE),
        }
      }),
    )
  }

  const handleSave = async () => {
    if (!initialData) return

    // 근무시간이 0보다 큰 항목만 전송
    const details = items.filter((item) => (item.workHour || 0) > 0)

    if (isPreview) {
      if (!onPreviewSave) {
        console.warn('[OverTimeWorkEdit] isPreview=true이지만 onPreviewSave가 전달되지 않았습니다.')
        return
      }
      onPreviewSave(details)
      router.back()
      return
    }

    if (!overtimeId) return

    try {
      await updateOvertime({
        id: overtimeId,
        data: {
          allowanceYearMonth: initialData.allowanceYearMonth,
          calculationStartDate: initialData.calculationStartDate,
          calculationEndDate: initialData.calculationEndDate,
          paymentDate: initialData.paymentDate || undefined,
          details,
          remarks: initialData.remarks || undefined,
        },
      })
      alert('근무시간이 저장되었습니다.')
      router.push(`/overtime/${overtimeId}`)
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
                    <div className="s-txt">연장근무 시간을 입력하지 않을 경우 해당 날짜는 연장근무를 하지 않은 날짜로 인식합니다.</div>
                    <div className="s-txt">총근무시간은 연장근무 시작시간에서 종료시간까지의 모든 시간을 입력하세요.</div>
                    <div className="s-txt">휴게시간은 총연장근무시간에서 제외하고 급여명세서에 표시됩니다.</div>
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
                      계약시간 적용 (시급 × 1.5)
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
                      <div className="work-time-info-badge g">연장근무</div>
                      <div className="work-time-info-val">
                        {item.actualOvertimeHours > 0
                          ? `${item.actualOvertimeHours}시간${item.overtimeStartTime && item.overtimeEndTime ? ` (${item.overtimeStartTime}~${item.overtimeEndTime})` : ''}`
                          : '-'}
                      </div>
                    </div>
                    <div className="work-time-info-item">
                      <div className="work-time-info-badge r">계약시급</div>
                      <div className="work-time-info-val">
                        {contractTimelyAmount > 0 ? `${formatAmount(contractTimelyAmount)}원` : '-'}
                      </div>
                    </div>
                  </div>
                  <div className="work-time-data-wrap">
                    <div className="work-time-data-item">
                      <div className="work-time-data-item-tit">연장 근무시간</div>
                      <div className="block mb8">
                        <select
                          className="select-form"
                          value={item.overtimeStartTime ?? ''}
                          onChange={(e) => updateItem(index, { overtimeStartTime: e.target.value || undefined })}
                        >
                          <option value="">시작시간</option>
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div className="block">
                        <select
                          className="select-form"
                          value={item.overtimeEndTime ?? ''}
                          onChange={(e) => updateItem(index, { overtimeEndTime: e.target.value || undefined })}
                        >
                          <option value="">종료시간</option>
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
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
                  {item.actualPaymentAmount > 0 && (
                    <div className="work-time-info" style={{ marginTop: '8px' }}>
                      <div className="work-time-info-item">
                        <div className="badge d-green">지급액</div>
                        <div className="work-time-info-val">{formatAmount(item.actualPaymentAmount)}원</div>
                      </div>
                      <div className="work-time-info-item">
                        <div className="badge d-red">공제액</div>
                        <div className="work-time-info-val">{formatAmount(item.deductionAmount)}원</div>
                      </div>
                    </div>
                  )}
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
          disabled={isUpdating}
        >
          {isUpdating ? '저장 중...' : '저장하기'}
        </button>
      </div>
    </>
  )
}
