'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { Sheet } from 'react-modal-sheet'
import WorkScheduleFields from '@/components/bottomsheet/WorkScheduleFields'
import type { WorkerEditItem } from '@/types/schedule'

export default function TemporaryWorkerAddSheet() {
  const temporaryWorkerAddSheet = useBottomSheetControler((state) => state.temporaryWorkerAddSheet)
  const closeTemporaryWorkerAddSheet = useBottomSheetControler((state) => state.closeTemporaryWorkerAddSheet)
  const onTempWorkerAdd = useBottomSheetControler((state) => state.onTempWorkerAdd)
  const openTimePicker = useBottomSheetControler((state) => state.openTimePicker)
  const defaultDates = useBottomSheetControler((state) => state.workerAddDefaultDates)

  const [tempName, setTempName] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [workStart, setWorkStart] = useState('')
  const [workEnd, setWorkEnd] = useState('')
  const [breakStart, setBreakStart] = useState('')
  const [breakEnd, setBreakEnd] = useState('')

  const handleClose = () => {
    closeTemporaryWorkerAddSheet()
  }

  const handleOpenStart = () => {
    setTempName('')
    setFromDate(defaultDates.from)
    setToDate(defaultDates.to)
    setWorkStart('')
    setWorkEnd('')
    setBreakStart('')
    setBreakEnd('')
  }

  const handleAdd = () => {
    if (!tempName.trim() || !fromDate || !toDate || !workStart || !workEnd) {
      console.warn('[TemporaryWorkerAddSheet] 유효성 검사 실패 — 필수 값 누락')
      return
    }

    const hasBreak = !!breakStart && !!breakEnd

    const newWorker: WorkerEditItem = {
      shiftId: null,
      workerId: null,
      workerName: tempName.trim(),
      contractType: '임시근무',
      hasWork: true,
      workStartTime: workStart,
      workEndTime: workEnd,
      hasBreak,
      breakStartTime: hasBreak ? breakStart : null,
      breakEndTime: hasBreak ? breakEnd : null,
      isDeleted: false,
      isNew: true,
      iconType: 0,
    }
    try {
      onTempWorkerAdd?.(newWorker, fromDate, toDate)
    } catch (err) {
      console.error('[TemporaryWorkerAddSheet] 임시 근무자 추가 콜백 실패:', err)
    } finally {
      handleClose()
    }
  }

  const isDateMissing = !fromDate || !toDate
  const hasPartialBreak = (!!breakStart) !== (!!breakEnd)
  const isValid = tempName.trim() && !isDateMissing && workStart && workEnd && !hasPartialBreak

  return (
    <Sheet
      isOpen={temporaryWorkerAddSheet}
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
              <h3>임시 근무자 추가</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="sheet-data-wrap">
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    이름<span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      placeholder="임시 근무자 이름"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                    />
                  </div>
                </div>
                <WorkScheduleFields
                  fromDate={fromDate}
                  toDate={toDate}
                  workStart={workStart}
                  workEnd={workEnd}
                  breakStart={breakStart}
                  breakEnd={breakEnd}
                  defaultDates={defaultDates}
                  onFromDateChange={setFromDate}
                  onToDateChange={setToDate}
                  openTimePicker={openTimePicker}
                  onWorkStartChange={setWorkStart}
                  onWorkEndChange={setWorkEnd}
                  onBreakStartChange={setBreakStart}
                  onBreakEndChange={setBreakEnd}
                />
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
