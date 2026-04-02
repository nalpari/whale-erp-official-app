'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useOvertimeSearchStore } from '@/store/useOvertimeSearchStore'
import { Sheet } from 'react-modal-sheet'

const WORK_STATUS_OPTIONS = [
  { value: 'EMPWK_001', label: '근무' },
  { value: 'EMPWK_002', label: '휴직' },
  { value: 'EMPWK_003', label: '퇴사' },
] as const

const WORK_DAY_OPTIONS = [
  { value: 'WEEKDAY', label: '평일' },
  { value: 'SATURDAY', label: '토요일' },
  { value: 'SUNDAY', label: '일요일' },
] as const

export default function OverTimeSearchSheet() {
  const overTimeSearchSheet = useBottomSheetControler(
    (state) => state.overTimeSearchSheet,
  )
  const setOverTimeSearchSheet = useBottomSheetControler(
    (state) => state.setOverTimeSearchSheet,
  )
  const searchParams = useOvertimeSearchStore((s) => s.searchParams)
  const setSearchParams = useOvertimeSearchStore((s) => s.setSearchParams)
  const search = useOvertimeSearchStore((s) => s.search)
  const reset = useOvertimeSearchStore((s) => s.reset)

  const [workStatus, setWorkStatus] = useState<string>(searchParams.workStatus ?? '')
  const [memberName, setMemberName] = useState(searchParams.memberName ?? '')
  const [workDays, setWorkDays] = useState<string[]>(searchParams.workDays ?? [])
  const [paymentStartDate, setPaymentStartDate] = useState(searchParams.paymentStartDate ?? '')
  const [paymentEndDate, setPaymentEndDate] = useState(searchParams.paymentEndDate ?? '')

  const handleOpenStart = () => {
    setWorkStatus(searchParams.workStatus ?? '')
    setMemberName(searchParams.memberName ?? '')
    setWorkDays(searchParams.workDays ?? [])
    setPaymentStartDate(searchParams.paymentStartDate ?? '')
    setPaymentEndDate(searchParams.paymentEndDate ?? '')
  }

  const handleClose = () => {
    setOverTimeSearchSheet(false)
  }

  const handleWorkDayToggle = (value: string) => {
    setWorkDays((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value],
    )
  }

  const handleSearch = () => {
    try {
      setSearchParams({
        workStatus: workStatus || undefined,
        memberName: memberName || undefined,
        workDays: workDays.length > 0 ? workDays : undefined,
        paymentStartDate: paymentStartDate || undefined,
        paymentEndDate: paymentEndDate || undefined,
      })
      search()
    } catch (err) {
      console.error('[OverTimeSearchSheet] 검색 실패:', err)
    } finally {
      handleClose()
    }
  }

  const handleReset = () => {
    setWorkStatus('')
    setMemberName('')
    setWorkDays([])
    setPaymentStartDate('')
    setPaymentEndDate('')
    reset()
  }

  return (
    <Sheet
      isOpen={overTimeSearchSheet}
      onClose={handleClose}
      onOpenStart={handleOpenStart}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>검색조건</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="sheet-data-wrap">
                <div className="sheet-data-filed">
                  <div className="filed-tit">근무여부</div>
                  <div className="flex g8">
                    {WORK_STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        className={`radio-btn block${workStatus === opt.value ? ' act' : ''}`}
                        onClick={() => setWorkStatus(workStatus === opt.value ? '' : opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">직원명</div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      placeholder="직원명 검색"
                    />
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">근무요일</div>
                  <div className="flex g8">
                    {WORK_DAY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        className={`radio-btn block${workDays.includes(opt.value) ? ' act' : ''}`}
                        onClick={() => handleWorkDayToggle(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">급여일</div>
                  <div className="flex g8">
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={paymentStartDate}
                        onChange={(e) => setPaymentStartDate(e.target.value)}
                      />
                    </div>
                    <span>~</span>
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={paymentEndDate}
                        onChange={(e) => setPaymentEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky" onClick={handleReset}>
                초기화
              </button>
              <button className="btn-form blue" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  )
}
