'use client'
import { useRouter, useParams } from 'next/navigation'
import { useContractsByEmployee } from '@/hooks/queries/use-contract-queries'
import type { PartTimerPayrollDetail, PartTimerPaymentItem } from '@/types/parttime-payroll'

interface PartTimerPayStubProps {
  initialData?: PartTimerPayrollDetail
  isPreview?: boolean
}

const formatAmount = (amount: number) => (amount ?? 0).toLocaleString('ko-KR')

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

const formatDateShort = (dateStr: string) => {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}(${DAY_NAMES[d.getDay()]})`
}

// 주차별로 그룹핑
const groupByWeek = (items: PartTimerPaymentItem[]) => {
  const weeks: { weekStart: string; weekEnd: string; items: PartTimerPaymentItem[] }[] = []
  const sorted = [...items].filter((i) => i.workDay).sort((a, b) => a.workDay.localeCompare(b.workDay))

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

export default function PartTimerPayStub({ initialData, isPreview = false }: PartTimerPayStubProps) {
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  // 직원 계약 정보 조회
  const contractEmployeeId = initialData?.employeeInfoId ?? 0
  const { data: contracts = [] } = useContractsByEmployee(contractEmployeeId, contractEmployeeId > 0)
  const contract = contracts[0] ?? null

  if (!initialData) {
    return (
      <div className="container sub">
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          데이터가 없습니다.
        </div>
      </div>
    )
  }

  const weeks = groupByWeek(initialData.paymentItems ?? [])
  const weeklyAllowanceMap = new Map(
    (initialData.weeklyPaidHolidayAllowances ?? []).map((w) => [w.weekStartDate ?? String(w.workWeek), w]),
  )

  // API: bonusName/bonusAmount/isActive, session: bonusType/amount/enabled — 통합 정규화
  const bonusItems = (initialData.bonusItems ?? [])
    .filter((b) => (b.isActive ?? b.enabled) !== false)
    .map((b) => ({
      name: b.bonusName ?? b.bonusType ?? '',
      amount: b.bonusAmount ?? b.amount ?? 0,
      deduction: b.deductionAmount ?? 0,
      key: b.bonusCode ?? b.bonusName ?? b.bonusType ?? '',
    }))
  const bonusTotal = bonusItems.reduce((sum, b) => sum + b.amount, 0)
  const bonusDeductionTotal = bonusItems.reduce((sum, b) => sum + b.deduction, 0)

  const totalPayment = (initialData.paymentItems ?? []).reduce((sum, i) => sum + i.totalAmount, 0)
  const weeklyHolidayNet = (initialData.weeklyPaidHolidayAllowances ?? []).reduce((sum, w) => sum + (w.netAmount || 0), 0)
  const weeklyHolidayDeduction = (initialData.weeklyPaidHolidayAllowances ?? []).reduce((sum, w) => sum + (w.deductionAmount || 0), 0)
  const insuranceDeduction = (initialData.deductionItems ?? []).reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="container sub">
      <div className="sub-content-body">
        <button
          className="work-time-edit"
          onClick={() => {
            if (isPreview) {
              router.push('/parttimer/new/time')
            } else {
              router.push(`/parttimer/${id}/time`)
            }
          }}
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
              {weeks.map((week) => {
                const weekTotal = week.items.reduce((sum, i) => sum + i.totalAmount, 0)
                const weekDeduction = week.items.reduce((sum, i) => sum + i.deductionAmount, 0)
                const weekHours = week.items.reduce((sum, i) => sum + i.workHour, 0)
                const holiday = weeklyAllowanceMap.get(week.weekStart)

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

              {/* 상여금 */}
              {bonusItems.length > 0 && (
                <div className="pay-stub-item week">
                  <div className="pay-stub-item-head">
                    <div className="pay-stub-item-head-tit">상여금</div>
                    <div className="pay-stub-item-head-val">{formatAmount(bonusTotal - bonusDeductionTotal)}원</div>
                  </div>
                  <ul className="pay-stub-table-list">
                    {bonusItems.map((bonus, idx) => (
                      <li className="pay-stub-table-list-item" key={bonus.key || idx}>
                        <div className="pay-stub-table-list-tit">{bonus.name}</div>
                        <div className="pay-stub-table-list-val">{formatAmount(bonus.amount)}원</div>
                      </li>
                    ))}
                    <li className="pay-stub-table-list-item">
                      <div className="pay-stub-table-list-tit">공제액</div>
                      <div className="pay-stub-table-list-val">{formatAmount(bonusDeductionTotal)}</div>
                    </li>
                  </ul>
                </div>
              )}

              {/* 급여 합계 */}
              <div className="pay-stub-item last-week">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">급여소계</div>
                  <div className="pay-stub-item-head-val">{formatAmount(totalPayment + bonusTotal)}원</div>
                </div>
                {insuranceDeduction > 0 && (
                  <div className="pay-stub-item-head">
                    <div className="pay-stub-item-head-tit">4대보험 공제</div>
                    <div className="pay-stub-item-head-val">-{formatAmount(insuranceDeduction)}원</div>
                  </div>
                )}
                {weeklyHolidayNet > 0 && (
                  <div className="pay-stub-item-head">
                    <div className="pay-stub-item-head-tit">주휴수당 합계</div>
                    <div className="pay-stub-item-head-val">+{formatAmount(weeklyHolidayNet)}원</div>
                  </div>
                )}
                {weeklyHolidayDeduction > 0 && (
                  <div className="pay-stub-item-head">
                    <div className="pay-stub-item-head-tit">주휴수당 공제</div>
                    <div className="pay-stub-item-head-val">-{formatAmount(weeklyHolidayDeduction)}원</div>
                  </div>
                )}
                {bonusTotal > 0 && (
                  <div className="pay-stub-item-head">
                    <div className="pay-stub-item-head-tit">상여금 합계</div>
                    <div className="pay-stub-item-head-val">+{formatAmount(bonusTotal)}원</div>
                  </div>
                )}
                {bonusDeductionTotal > 0 && (
                  <div className="pay-stub-item-head">
                    <div className="pay-stub-item-head-tit">상여금 공제</div>
                    <div className="pay-stub-item-head-val">-{formatAmount(bonusDeductionTotal)}원</div>
                  </div>
                )}
              </div>

              {/* 실지급액 */}
              <div className="pay-stub-item total">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">실지급액</div>
                  <div className="pay-stub-item-head-val">
                    {formatAmount(initialData.actualPaymentAmount + bonusTotal - bonusDeductionTotal)}원
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
