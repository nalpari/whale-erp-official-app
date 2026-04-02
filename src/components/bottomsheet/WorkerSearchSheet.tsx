'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { Sheet } from 'react-modal-sheet'

export default function WorkerSearchSheet() {
  const workerSearchSheet = useBottomSheetControler((state) => state.workerSearchSheet)
  const setWorkerSearchSheet = useBottomSheetControler((state) => state.setWorkerSearchSheet)
  const onWorkerSearch = useBottomSheetControler((state) => state.onWorkerSearch)
  const employees = useBottomSheetControler((state) => state.workerSheetEmployees)
  const initial = useBottomSheetControler((state) => state.workerSearchInitial)

  const [selectedEmployeeName, setSelectedEmployeeName] = useState('')
  const [tempWorkerName, setTempWorkerName] = useState('')

  const handleClose = () => {
    setWorkerSearchSheet(false)
  }

  // 바텀시트 열릴 때 기존 검색 조건 복원
  const handleOpenStart = () => {
    setSelectedEmployeeName(initial.employeeName)
    setTempWorkerName(initial.tempWorkerName)
  }

  const handleSearch = () => {
    try {
      onWorkerSearch?.({ employeeName: selectedEmployeeName, tempWorkerName })
    } catch (err) {
      console.error('[WorkerSearchSheet] 검색 콜백 실���:', err)
    } finally {
      handleClose()
    }
  }

  const handleReset = () => {
    setSelectedEmployeeName('')
    setTempWorkerName('')
  }

  return (
    <Sheet
      isOpen={workerSearchSheet}
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
                  <div className="filed-tit">직원명</div>
                  <div className="block">
                    <select
                      className="select-form"
                      value={selectedEmployeeName}
                      onChange={(e) => setSelectedEmployeeName(e.target.value)}
                    >
                      <option value="">전체</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.name}>
                          {emp.name}{emp.employeeNumber ? ` (${emp.employeeNumber})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">임시 근무자명</div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      placeholder="임시 근무자명"
                      value={tempWorkerName}
                      onChange={(e) => setTempWorkerName(e.target.value)}
                    />
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
