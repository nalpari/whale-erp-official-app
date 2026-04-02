'use client'
import { useRouter, useParams } from 'next/navigation'
import type { OvertimeAllowanceDetail, OvertimeAllowanceItemDto } from '@/types/overtime'

interface OverTimeStubProps {
  initialData?: OvertimeAllowanceDetail
  isPreview?: boolean
}

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

const parseLocalDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const formatDateShort = (dateStr: string) => {
  const d = parseLocalDate(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}(${DAY_NAMES[d.getDay()]})`
}

// 주차별로 그룹핑
const groupByWeek = (items: OvertimeAllowanceItemDto[]) => {
  const weeks: { weekStart: string; weekEnd: string; items: OvertimeAllowanceItemDto[] }[] = []
  const sorted = [...items].filter((i) => i.workDay).sort((a, b) => a.workDay.localeCompare(b.workDay))

  for (const item of sorted) {
    const d = parseLocalDate(item.workDay)
    const day = d.getDay()
    const weekStart = new Date(d)
    weekStart.setDate(d.getDate() - day)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const fmt = (dt: Date) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
    const weekKey = fmt(weekStart)
    let week = weeks.find((w) => w.weekStart === weekKey)
    if (!week) {
      week = { weekStart: weekKey, weekEnd: fmt(weekEnd), items: [] }
      weeks.push(week)
    }
    week.items.push(item)
  }
  return weeks
}

const formatWeekRange = (start: string, end: string) => {
  const s = parseLocalDate(start)
  const e = parseLocalDate(end)
  return `${s.getMonth() + 1}.${String(s.getDate()).padStart(2, '0')}~${e.getMonth() + 1}.${String(e.getDate()).padStart(2, '0')}`
}

export default function OverTimeStub({ initialData, isPreview = false }: OverTimeStubProps) {
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

  const weeks = groupByWeek(initialData.details ?? [])
  const totalPayment = (initialData.details ?? []).reduce((sum, i) => sum + (i.actualPaymentAmount || 0), 0)
  const totalDeduction = (initialData.details ?? []).reduce((sum, i) => sum + (i.deductionAmount || 0), 0)
  const totalHours = (initialData.details ?? []).reduce((sum, i) => sum + (i.actualOvertimeHours || 0), 0)
  const actualPayment = totalPayment - totalDeduction

  return (
    <div className="container sub">
      <div className="sub-content-body">
        <button
          className="work-time-edit"
          onClick={() => {
            if (isPreview) {
              router.push('/overtime/new/time')
            } else {
              router.push(`/overtime/${id}/time`)
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
                연장근무 내역<span className="imp"> *</span>
              </div>
            </div>
            <div className="pay-stub-wrap">
              {weeks.map((week) => {
                const weekPayment = week.items.reduce((sum, i) => sum + (i.actualPaymentAmount || 0), 0)
                const weekDeduction = week.items.reduce((sum, i) => sum + (i.deductionAmount || 0), 0)
                const weekHours = week.items.reduce((sum, i) => sum + (i.actualOvertimeHours || 0), 0)

                return (
                  <div key={week.weekStart}>
                    {/* 일별 연장근무 기록 */}
                    {week.items.map((item) => (
                      <div className="pay-stub-item day" key={item.workDay}>
                        <div className="pay-stub-item-head">
                          <div className="pay-stub-item-head-tit">{formatDateShort(item.workDay)}</div>
                          <div className="pay-stub-item-head-val">
                            {formatAmount(item.actualPaymentAmount - item.deductionAmount)}원
                          </div>
                        </div>
                        <ul className="pay-stub-table-list">
                          <li className="pay-stub-table-list-item">
                            <div className="pay-stub-table-list-tit">시간</div>
                            <div className="pay-stub-table-list-val">{item.actualOvertimeHours}</div>
                          </li>
                          <li className="pay-stub-table-list-item">
                            <div className="pay-stub-table-list-tit">시급</div>
                            <div className="pay-stub-table-list-val">{formatAmount(item.applyTimelyAmount)}</div>
                          </li>
                          <li className="pay-stub-table-list-item">
                            <div className="pay-stub-table-list-tit">지급액</div>
                            <div className="pay-stub-table-list-val">{formatAmount(item.actualPaymentAmount)}</div>
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
                        <div className="pay-stub-item-head-tit">
                          <span>주간소계</span>
                          <span>{formatWeekRange(week.weekStart, week.weekEnd)}</span>
                        </div>
                        <div className="pay-stub-item-head-val">{formatAmount(weekPayment - weekDeduction)}원</div>
                      </div>
                      <ul className="pay-stub-table-list">
                        <li className="pay-stub-table-list-item">
                          <div className="pay-stub-table-list-tit">근무시간</div>
                          <div className="pay-stub-table-list-val">{weekHours}시간</div>
                        </li>
                        <li className="pay-stub-table-list-item">
                          <div className="pay-stub-table-list-tit">지급액</div>
                          <div className="pay-stub-table-list-val">{formatAmount(weekPayment)}</div>
                        </li>
                        <li className="pay-stub-table-list-item">
                          <div className="pay-stub-table-list-tit">공제액</div>
                          <div className="pay-stub-table-list-val">{formatAmount(weekDeduction)}</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                )
              })}

              {/* 급여 합계 */}
              <div className="pay-stub-item last-week">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">급여합계</div>
                  <div className="pay-stub-item-head-val">{formatAmount(totalPayment)}원</div>
                </div>
                <ul className="pay-stub-table-list">
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">총 시간</div>
                    <div className="pay-stub-table-list-val">{totalHours}시간</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">지급총액</div>
                    <div className="pay-stub-table-list-val">{formatAmount(totalPayment)}</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">공제총액</div>
                    <div className="pay-stub-table-list-val">{formatAmount(totalDeduction)}</div>
                  </li>
                </ul>
              </div>

              {/* 실지급액 */}
              <div className="pay-stub-item total">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">실지급액</div>
                  <div className="pay-stub-item-head-val">
                    {formatAmount(actualPayment)}원
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
