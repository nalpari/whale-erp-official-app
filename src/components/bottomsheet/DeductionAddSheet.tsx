'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { Sheet } from 'react-modal-sheet'
import type { PartTimerDeductionItem } from '@/types/parttime-payroll'

const formatNumber = (value: string) => {
  const num = value.replace(/[^\d]/g, '')
  return num ? Number(num).toLocaleString('ko-KR') : ''
}

const parseNumber = (value: string) => {
  return Number(value.replace(/[^\d]/g, '')) || 0
}

interface DeductionAddSheetProps {
  settlementStartDate: string
  settlementEndDate: string
  deductionItems: PartTimerDeductionItem[]
  onSave: (data: {
    settlementStartDate: string
    settlementEndDate: string
    deductionItems: PartTimerDeductionItem[]
  }) => void
}

const DEFAULT_DEDUCTION_ITEMS: PartTimerDeductionItem[] = [
  { itemCode: 'NATIONAL_PENSION', itemOrder: 1, amount: 0, remarks: '국민연금' },
  { itemCode: 'HEALTH_INSURANCE', itemOrder: 2, amount: 0, remarks: '건강보험' },
  { itemCode: 'EMPLOYMENT_INSURANCE', itemOrder: 3, amount: 0, remarks: '고용보험' },
  { itemCode: 'LONG_TERM_CARE_INSURANCE', itemOrder: 4, amount: 0, remarks: '장기요양보험' },
]

export default function DeductionAddSheet({
  settlementStartDate: externalStartDate,
  settlementEndDate: externalEndDate,
  deductionItems: externalDeductionItems,
  onSave,
}: DeductionAddSheetProps) {
  const deductionAddSheet = useBottomSheetControler(
    (state) => state.deductionAddSheet,
  )
  const setDeductionAddSheet = useBottomSheetControler(
    (state) => state.setDeductionAddSheet,
  )

  const [localStartDate, setLocalStartDate] = useState(externalStartDate)
  const [localEndDate, setLocalEndDate] = useState(externalEndDate)
  const [localDeductionItems, setLocalDeductionItems] = useState<PartTimerDeductionItem[]>(
    externalDeductionItems?.length > 0 ? externalDeductionItems : DEFAULT_DEDUCTION_ITEMS,
  )

  const handleOpenStart = () => {
    setLocalStartDate(externalStartDate)
    setLocalEndDate(externalEndDate)
    setLocalDeductionItems(
      externalDeductionItems?.length > 0 ? externalDeductionItems : DEFAULT_DEDUCTION_ITEMS,
    )
  }

  const handleClose = () => {
    setDeductionAddSheet(false)
  }

  const handleAmountChange = (index: number, value: string) => {
    const updated = [...localDeductionItems]
    updated[index] = { ...updated[index], amount: parseNumber(value) }
    setLocalDeductionItems(updated)
  }

  const handleSave = () => {
    onSave({
      settlementStartDate: localStartDate,
      settlementEndDate: localEndDate,
      deductionItems: localDeductionItems,
    })
    handleClose()
  }

  const handleReset = () => {
    setLocalStartDate(externalStartDate)
    setLocalEndDate(externalEndDate)
    setLocalDeductionItems(DEFAULT_DEDUCTION_ITEMS)
  }

  return (
    <Sheet
      isOpen={deductionAddSheet}
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
              <h3>근무기간 / 4대보험 공제액 설정</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="s-txt mt15">
                ※ 정확한 급여 계산을 위해 <b>근무기간을 반드시 입력</b>해 주세요.{' '}
                <b>4대보험 대상자에 한해 공제액을 입력</b>하며, 저장 시 급여 내역이 자동으로 계산됩니다.
              </div>
              <div className="sheet-data-wrap">
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    근무기간 <span className="imp">*</span>
                  </div>
                  <div className="flex g8">
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={localStartDate}
                        onChange={(e) => setLocalStartDate(e.target.value)}
                      />
                    </div>
                    <span>~</span>
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={localEndDate}
                        onChange={(e) => setLocalEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                {localDeductionItems.map((item, index) => (
                  <div className="sheet-data-filed" key={item.itemCode}>
                    <div className="filed-tit">{item.remarks || item.itemCode}</div>
                    <div className="block">
                      <input
                        type="text"
                        className="input-frame al-r"
                        inputMode="numeric"
                        value={item.amount ? formatNumber(String(item.amount)) : ''}
                        onChange={(e) => handleAmountChange(index, e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky" onClick={handleReset}>
                초기화
              </button>
              <button className="btn-form blue" onClick={handleSave}>
                저장
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  )
}
