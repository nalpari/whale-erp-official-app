'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { usePlanSearchStore } from '@/store/usePlanSearchStore'
import { Sheet } from 'react-modal-sheet'
import { DAY_OPTIONS } from '@/lib/schedule-utils'

export default function PlanTableSearchSheet() {
  const planSearchSheet = useBottomSheetControler((state) => state.planSearchSheet)
  const setPlanSearchSheet = useBottomSheetControler((state) => state.setPlanSearchSheet)
  const employeeName = usePlanSearchStore((s) => s.employeeName)
  const dayType = usePlanSearchStore((s) => s.dayType)
  const storeFrom = usePlanSearchStore((s) => s.from)
  const storeTo = usePlanSearchStore((s) => s.to)
  const setField = usePlanSearchStore((s) => s.setField)
  const search = usePlanSearchStore((s) => s.search)

  const [localEmployeeName, setLocalEmployeeName] = useState(employeeName)
  const [localDayType, setLocalDayType] = useState<string | null>(dayType)
  const [localFrom, setLocalFrom] = useState(storeFrom)
  const [localTo, setLocalTo] = useState(storeTo)

  const handleOpenStart = () => {
    setLocalEmployeeName(employeeName)
    setLocalDayType(dayType)
    setLocalFrom(storeFrom)
    setLocalTo(storeTo)
  }

  const handleClose = () => {
    setPlanSearchSheet(false)
  }

  const handleSearch = () => {
    if (!localFrom || !localTo) return
    setField('employeeName', localEmployeeName)
    setField('dayType', localDayType)
    setField('from', localFrom)
    setField('to', localTo)
    search()
    handleClose()
  }

  const handleReset = () => {
    setLocalEmployeeName('')
    setLocalDayType(null)
    setLocalFrom('')
    setLocalTo('')
  }

  const isSearchDisabled = !localFrom || !localTo

  return (
    <Sheet
      isOpen={planSearchSheet}
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
                    <input
                      type="text"
                      className="input-frame"
                      placeholder="직원명을 입력하세요"
                      value={localEmployeeName}
                      onChange={(e) => setLocalEmployeeName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">요일 선택</div>
                  <div className="block">
                    <select
                      className="select-form"
                      value={localDayType ?? ''}
                      onChange={(e) => setLocalDayType(e.target.value || null)}
                    >
                      <option value="">전체</option>
                      {DAY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    기간 선택 <span className="imp">*</span>
                  </div>
                  <div className="flex g8">
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={localFrom}
                        onChange={(e) => setLocalFrom(e.target.value)}
                      />
                    </div>
                    <span>~</span>
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={localTo}
                        onChange={(e) => setLocalTo(e.target.value)}
                      />
                    </div>
                  </div>
                  {isSearchDisabled && (
                    <div className="warning mt5" style={{ color: '#e74c3c' }}>
                      * 필수 입력값입니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky" onClick={handleReset}>
                초기화
              </button>
              <button
                className="btn-form blue"
                onClick={handleSearch}
                disabled={isSearchDisabled}
              >
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
