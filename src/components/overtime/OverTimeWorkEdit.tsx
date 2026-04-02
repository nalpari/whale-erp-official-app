'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUpdateOvertime } from '@/hooks/queries/use-overtime-queries'
import { usePopupControler } from '@/store/usePopupControler'
import { getErrorMessage } from '@/lib/api'
import { formatAmount, parseAmount, formatDateLabel, parseLocalDate, formatDate } from '@/lib/overtime-utils'
import type { OvertimeAllowanceDetail, OvertimeAllowanceItemDto } from '@/types/overtime'

interface OverTimeWorkEditProps {
  overtimeId?: number
  initialData?: OvertimeAllowanceDetail
  isPreview?: boolean
  onPreviewSave?: (items: OvertimeAllowanceItemDto[]) => void
  contractWage?: number
}

const DEDUCTION_RATE = 0.033

// 0.5시간 단위 옵션 (0~24)
const HOUR_OPTIONS = Array.from({ length: 49 }, (_, i) => i * 0.5)

// 휴게시간 옵션 (0~3시간, 30분 단위)
const BREAK_HOUR_OPTIONS = Array.from({ length: 7 }, (_, i) => i * 0.5)

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

export default function OverTimeWorkEdit({ overtimeId, initialData, isPreview = false, onPreviewSave, contractWage }: OverTimeWorkEditProps) {
  const router = useRouter()
  const openAlert = usePopupControler((s) => s.openAlert)
  const { mutateAsync: updateOvertime, isPending: isUpdating } = useUpdateOvertime()

  const contractTimelyAmount = contractWage
    ?? initialData?.details?.[0]?.contractTimelyAmount
    ?? 0

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
        applyTimelyAmount: contractTimelyAmount,
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


  const handleSave = async () => {
    if (!initialData) return

    if (isPreview) {
      if (!onPreviewSave) {
        console.warn('[OverTimeWorkEdit] isPreview=true이지만 onPreviewSave가 전달되지 않았습니다.')
        return
      }
      // 미리보기에는 전체 날짜 전달 (0시간 포함)
      onPreviewSave(items)
      router.back()
      return
    }

    // API 저장 시에만 근무시간이 0보다 큰 항목만 전송
    const details = items.filter((item) => (item.workHour || 0) > 0)

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
      openAlert({
        message: '근무시간이 저장되었습니다.',
        onConfirm: () => router.push(`/overtime/${overtimeId}`),
      })
    } catch (error) {
      openAlert({ message: getErrorMessage(error, '저장에 실패했습니다.') })
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
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      readOnly
                      value={initialData?.memberName ?? ''}
                    />
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
                          {BREAK_HOUR_OPTIONS.map((h) => (
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
