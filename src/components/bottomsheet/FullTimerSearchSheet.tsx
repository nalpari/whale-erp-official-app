'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { usePayrollSearchStore } from '@/store/usePayrollSearchStore'
import { Sheet } from 'react-modal-sheet'

type WorkStatus = '' | 'EMPWK_001' | 'EMPWK_002' | 'EMPWK_003'

const WORK_STATUS_OPTIONS: { value: WorkStatus; label: string }[] = [
  { value: 'EMPWK_001', label: '근무' },
  { value: 'EMPWK_002', label: '휴직' },
  { value: 'EMPWK_003', label: '퇴사' },
]

export default function FullTimerSearchSheet() {
  const fullTimerSearchSheet = useBottomSheetControler(
    (state) => state.fullTimerSearchSheet,
  )
  const setFullTimerSearchSheet = useBottomSheetControler(
    (state) => state.setFullTimerSearchSheet,
  )
  const { searchParams, setSearchParams, search, reset } = usePayrollSearchStore()

  // 로컬 폼 상태 — store의 현재 검색 조건으로 초기화 (조건부 마운트)
  const [workStatus, setWorkStatus] = useState<WorkStatus>(
    (searchParams.workStatus as WorkStatus) || '',
  )
  const [employeeName, setEmployeeName] = useState(searchParams.memberName ?? '')
  const [startDate, setStartDate] = useState(searchParams.paymentStartDate ?? '')
  const [endDate, setEndDate] = useState(searchParams.paymentEndDate ?? '')

  const handleClose = () => {
    setFullTimerSearchSheet(false)
  }

  const handleSearch = () => {
    setSearchParams({
      workStatus: workStatus || undefined,
      memberName: employeeName || undefined,
      paymentStartDate: startDate || undefined,
      paymentEndDate: endDate || undefined,
    })
    search()
    handleClose()
  }

  const handleReset = () => {
    setWorkStatus('')
    setEmployeeName('')
    setStartDate('')
    setEndDate('')
    reset()
  }

  return (
    <Sheet
      isOpen={fullTimerSearchSheet}
      onClose={handleClose}
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
                    {WORK_STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        className={`radio-btn block${workStatus === option.value ? ' act' : ''}`}
                        onClick={() =>
                          setWorkStatus(
                            workStatus === option.value ? '' : option.value,
                          )
                        }
                      >
                        {option.label}
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
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      placeholder="직원명을 입력하세요"
                    />
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">급여일</div>
                  <div className="flex g8">
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <span>~</span>
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
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
