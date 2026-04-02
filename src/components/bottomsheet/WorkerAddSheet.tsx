'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { Sheet } from 'react-modal-sheet'
import type { WorkerEditItem } from '@/types/schedule'

export default function WorkerAddSheet() {
  const workerAddSheet = useBottomSheetControler((state) => state.workerAddSheet)
  const setWorkerAddSheet = useBottomSheetControler((state) => state.setWorkerAddSheet)
  const onWorkerAdd = useBottomSheetControler((state) => state.onWorkerAdd)
  const employees = useBottomSheetControler((state) => state.workerSheetEmployees)
  const openTimePicker = useBottomSheetControler((state) => state.openTimePicker)
  const defaultDates = useBottomSheetControler((state) => state.workerAddDefaultDates)

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [workStart, setWorkStart] = useState('')
  const [workEnd, setWorkEnd] = useState('')
  const [breakStart, setBreakStart] = useState('')
  const [breakEnd, setBreakEnd] = useState('')

  const handleClose = () => {
    setWorkerAddSheet(false)
  }

  const handleOpenStart = () => {
    setSelectedEmployeeId(null)
    setFromDate(defaultDates.from)
    setToDate(defaultDates.to)
    setWorkStart('')
    setWorkEnd('')
    setBreakStart('')
    setBreakEnd('')
  }

  const handleAdd = () => {
    const emp = employees.find((e) => e.id === selectedEmployeeId)
    if (!emp || emp.memberId === null || !fromDate || !toDate || !workStart || !workEnd) return

    const newWorker: WorkerEditItem = {
      shiftId: null,
      workerId: emp.memberId,
      workerName: emp.name,
      contractType: emp.contractType,
      hasWork: true,
      workStartTime: workStart,
      workEndTime: workEnd,
      hasBreak: !!breakStart && !!breakEnd,
      breakStartTime: breakStart || null,
      breakEndTime: breakEnd || null,
      isDeleted: false,
      isNew: true,
      iconType: 0,
    }
    try {
      onWorkerAdd?.(newWorker, fromDate, toDate)
    } catch (err) {
      console.error('[WorkerAddSheet] 근무자 추가 콜백 실패:', err)
    } finally {
      handleClose()
    }
  }

  const selectedEmployee = employees.find((employee) => employee.id === selectedEmployeeId)
  const isDateMissing = !fromDate || !toDate
  const isValid = selectedEmployee?.memberId !== null && !isDateMissing && workStart && workEnd

  return (
    <Sheet
      isOpen={workerAddSheet}
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
              <h3>근무자 추가</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="sheet-data-wrap">
                <div className="sheet-data-filed">
                  <div className="filed-tit">직원명<span className="imp">*</span></div>
                  <div className="block">
                    <select
                      className="select-form"
                      value={selectedEmployeeId ?? ''}
                      onChange={(e) => setSelectedEmployeeId(e.target.value ? Number(e.target.value) : null)}
                    >
                      <option value="">선택</option>
                      {employees.filter((emp) => emp.memberId !== null).map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}{emp.employeeNumber ? ` (${emp.employeeNumber})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    기간 선택<span className="imp">*</span>
                  </div>
                  <div className="flex g8">
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={fromDate}
                        min={defaultDates.from || undefined}
                        max={toDate || defaultDates.to || undefined}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </div>
                    <span>~</span>
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={toDate}
                        min={fromDate || defaultDates.from || undefined}
                        max={defaultDates.to || undefined}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    근무시간<span className="imp">*</span>
                  </div>
                  <div className="flex g8">
                    <div className="block">
                      <button
                        className="select-form al-l"
                        onClick={() => openTimePicker('근무 시작시간', workStart || '09:00', (t) => setWorkStart(t ?? ''))}
                      >
                        {workStart || '시작시간'}
                      </button>
                    </div>
                    <div className="block">
                      <button
                        className="select-form al-l"
                        onClick={() => openTimePicker('근무 종료시간', workEnd || '18:00', (t) => setWorkEnd(t ?? ''))}
                      >
                        {workEnd || '종료시간'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">휴게시간</div>
                  <div className="flex g8">
                    <div className="block">
                      <button
                        className="select-form al-l"
                        onClick={() => openTimePicker('휴게 시작시간', breakStart || '12:00', (t) => setBreakStart(t ?? ''))}
                      >
                        {breakStart || '시작시간'}
                      </button>
                    </div>
                    <div className="block">
                      <button
                        className="select-form al-l"
                        onClick={() => openTimePicker('휴게 종료시간', breakEnd || '13:00', (t) => setBreakEnd(t ?? ''))}
                      >
                        {breakEnd || '종료시간'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky" onClick={handleClose}>
                취소
              </button>
              <button className="btn-form blue" onClick={handleAdd} disabled={!isValid}>
                추가
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  )
}
