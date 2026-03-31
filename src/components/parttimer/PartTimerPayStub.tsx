'use client'
import { useRouter, useParams } from 'next/navigation'
import type { PartTimerPayrollDetail, PartTimerPaymentItem } from '@/types/parttime-payroll'

interface PartTimerPayStubProps {
  initialData?: PartTimerPayrollDetail
}

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

const formatDateShort = (dateStr: string) => {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}(${DAY_NAMES[d.getDay()]})`
}

// 주차별로 그룹핑
const groupByWeek = (items: PartTimerPaymentItem[]) => {
  const weeks: { weekStart: string; weekEnd: string; items: PartTimerPaymentItem[] }[] = []
  const sorted = [...items].sort((a, b) => a.workDay.localeCompare(b.workDay))

  for (const item of sorted) {
    const d = new Date(item.workDay)
    const day = d.getDay()
    const weekStart = new Date(d)
    weekStart.setDate(d.getDate() - day)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const weekKey = weekStart.toISOString().slice(0, 10)
    let week = weeks.find((w) => w.weekStart === weekKey)
    if (!week) {
      week = { weekStart: weekKey, weekEnd: weekEnd.toISOString().slice(0, 10), items: [] }
      weeks.push(week)
    }
    week.items.push(item)
  }
  return weeks
}

export default function PartTimerPayStub({ initialData }: PartTimerPayStubProps) {
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  if (!initialData) {
    return (
      <div className="container sub">
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          데이터가 없습니다.
        </div>
      </div>
    )
  }

  const weeks = groupByWeek(initialData.paymentItems)
  const weeklyAllowanceMap = new Map(
    initialData.weeklyPaidHolidayAllowances.map((w) => [w.workWeek, w]),
  )

  const totalPayment = initialData.paymentItems.reduce((sum, i) => sum + i.totalAmount, 0)
  const weeklyHolidayTotal = initialData.weeklyPaidHolidayAllowances.reduce((sum, w) => sum + w.totalAmount, 0)
  const insuranceDeduction = initialData.deductionItems.reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="container sub">
      <div className="sub-content-body">
        <button
          className="work-time-edit"
          onClick={() => router.push(`/parttimer/${id}/time`)}
        >
          <div className="work-time-edit-tit">
            <i className="time-edit-icon"></i>
            <span>근무시간 수정</span>
          </div>
          <div className="auto-right">
            <i className="contract-arr"></i>
          </div>
        </button>

        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-cont-tit-wrap">
              <div className="sub-cont-tit">
                급여내역<span className="imp"> *</span>
              </div>
            </div>
            <div className="pay-stub-wrap">
              {weeks.map((week, weekIndex) => {
                const weekTotal = week.items.reduce((sum, i) => sum + i.totalAmount, 0)
                const weekDeduction = week.items.reduce((sum, i) => sum + i.deductionAmount, 0)
                const weekHours = week.items.reduce((sum, i) => sum + i.workHour, 0)
                const holiday = weeklyAllowanceMap.get(weekIndex + 1)

                return (
                  <div key={week.weekStart}>
                    {/* 일별 근무 기록 */}
                    {week.items.map((item) => (
                      <div className="pay-stub-item day" key={item.workDay}>
                        <div className="pay-stub-item-head">
                          <div className="pay-stub-item-head-tit">{formatDateShort(item.workDay)}</div>
                        </div>
                        <ul className="pay-stub-table-list">
                          <li className="pay-stub-table-list-item">
                            <div className="pay-stub-table-list-tit">시간</div>
                            <div className="pay-stub-table-list-val">{item.workHour}</div>
                          </li>
                          <li className="pay-stub-table-list-item">
                            <div className="pay-stub-table-list-tit">시급</div>
                            <div className="pay-stub-table-list-val">{formatAmount(item.applyTimelyAmount)}</div>
                          </li>
                          <li className="pay-stub-table-list-item">
                            <div className="pay-stub-table-list-tit">지급액</div>
                            <div className="pay-stub-table-list-val">{formatAmount(item.totalAmount)}</div>
                          </li>
                          <li className="pay-stub-table-list-item">
                            <div className="pay-stub-table-list-tit">공제액</div>
                            <div className="pay-stub-table-list-val">{formatAmount(item.deductionAmount)}</div>
                          </li>
                        </ul>
                      </div>
                    ))}

                    {/* 주간소계 */}
                    <div className="pay-stub-item week">
                      <div className="pay-stub-item-head">
                        <div className="pay-stub-item-head-tit">주간소계</div>
                        <div className="pay-stub-item-head-val">{formatAmount(weekTotal - weekDeduction)}원</div>
                      </div>
                      <ul className="pay-stub-table-list">
                        <li className="pay-stub-table-list-item">
                          <div className="pay-stub-table-list-tit">근무시간</div>
                          <div className="pay-stub-table-list-val">{weekHours}시간</div>
                        </li>
                        <li className="pay-stub-table-list-item">
                          <div className="pay-stub-table-list-tit">지급액</div>
                          <div className="pay-stub-table-list-val">{formatAmount(weekTotal)}</div>
                        </li>
                        <li className="pay-stub-table-list-item">
                          <div className="pay-stub-table-list-tit">공제액</div>
                          <div className="pay-stub-table-list-val">{formatAmount(weekDeduction)}</div>
                        </li>
                      </ul>
                    </div>

                    {/* 주휴수당 */}
                    {holiday && (
                      <div className="pay-stub-item week">
                        <div className="pay-stub-item-head">
                          <div className="pay-stub-item-head-tit">주휴수당</div>
                          <div className="pay-stub-item-head-val">{formatAmount(holiday.netAmount)}원</div>
                        </div>
                        <ul className="pay-stub-table-list">
                          <li className="pay-stub-table-list-item">
                            <div className="pay-stub-table-list-tit">인정시간</div>
                            <div className="pay-stub-table-list-val">{holiday.workTime}시간</div>
                          </li>
                          <li className="pay-stub-table-list-item">
                            <div className="pay-stub-table-list-tit">시급</div>
                            <div className="pay-stub-table-list-val">{formatAmount(holiday.applyTimelyAmount)}</div>
                          </li>
                          <li className="pay-stub-table-list-item">
                            <div className="pay-stub-table-list-tit">지급액</div>
                            <div className="pay-stub-table-list-val">{formatAmount(holiday.totalAmount)}</div>
                          </li>
                          <li className="pay-stub-table-list-item">
                            <div className="pay-stub-table-list-tit">공제액</div>
                            <div className="pay-stub-table-list-val">{formatAmount(holiday.deductionAmount)}</div>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* 급여 합계 */}
              <div className="pay-stub-item last-week">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">급여소계</div>
                  <div className="pay-stub-item-head-val">{formatAmount(totalPayment)}원</div>
                </div>
                {insuranceDeduction > 0 && (
                  <div className="pay-stub-item-head">
                    <div className="pay-stub-item-head-tit">4대보험 공제</div>
                    <div className="pay-stub-item-head-val">-{formatAmount(insuranceDeduction)}원</div>
                  </div>
                )}
                {weeklyHolidayTotal > 0 && (
                  <div className="pay-stub-item-head">
                    <div className="pay-stub-item-head-tit">주휴수당 합계</div>
                    <div className="pay-stub-item-head-val">+{formatAmount(weeklyHolidayTotal)}원</div>
                  </div>
                )}
              </div>

              {/* 실지급액 */}
              <div className="pay-stub-item total">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">실지급액</div>
                  <div className="pay-stub-item-head-val">
                    {formatAmount(initialData.actualPaymentAmount)}원
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
