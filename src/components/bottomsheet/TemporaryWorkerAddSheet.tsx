'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { Sheet } from 'react-modal-sheet'
import type { WorkerEditItem } from '@/types/schedule'

export default function TemporaryWorkerAddSheet() {
  const temporaryWorkerAddSheet = useBottomSheetControler((state) => state.temporaryWorkerAddSheet)
  const setTemporaryWorkerAddSheet = useBottomSheetControler((state) => state.setTemporaryWorkerAddSheet)
  const onTempWorkerAdd = useBottomSheetControler((state) => state.onTempWorkerAdd)
  const openTimePicker = useBottomSheetControler((state) => state.openTimePicker)

  const [tempName, setTempName] = useState('')
  const [workStart, setWorkStart] = useState('')
  const [workEnd, setWorkEnd] = useState('')
  const [breakStart, setBreakStart] = useState('')
  const [breakEnd, setBreakEnd] = useState('')

  const handleClose = () => {
    setTemporaryWorkerAddSheet(false)
  }

  const handleOpenStart = () => {
    setTempName('')
    setWorkStart('')
    setWorkEnd('')
    setBreakStart('')
    setBreakEnd('')
  }

  const handleAdd = () => {
    if (!tempName.trim() || !workStart || !workEnd) return

    const newWorker: WorkerEditItem = {
      shiftId: null,
      workerId: null,
      workerName: tempName.trim(),
      contractType: '임시근무',
      hasWork: true,
      workStartTime: workStart,
      workEndTime: workEnd,
      hasBreak: !!breakStart && !!breakEnd,
      breakStartTime: breakStart || null,
      breakEndTime: breakEnd || null,
      isDeleted: false,
      isNew: true,
    }
    onTempWorkerAdd?.(newWorker)
    handleClose()
  }

  const isValid = tempName.trim() && workStart && workEnd

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
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    근무시간<span className="imp">*</span>
                  </div>
                  <div className="flex g8">
                    <div className="block">
                      <button
                        className="select-form al-l"
                        onClick={() => openTimePicker('근무 시작시간', workStart || '09:00', setWorkStart)}
                      >
                        {workStart || '시작시간'}
                      </button>
                    </div>
                    <div className="block">
                      <button
                        className="select-form al-l"
                        onClick={() => openTimePicker('근무 종료시간', workEnd || '18:00', setWorkEnd)}
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
                        onClick={() => openTimePicker('휴게 시작시간', breakStart || '12:00', setBreakStart)}
                      >
                        {breakStart || '시작시간'}
                      </button>
                    </div>
                    <div className="block">
                      <button
                        className="select-form al-l"
                        onClick={() => openTimePicker('휴게 종료시간', breakEnd || '13:00', setBreakEnd)}
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
