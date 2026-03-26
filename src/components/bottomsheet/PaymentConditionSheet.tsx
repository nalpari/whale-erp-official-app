'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { Sheet } from 'react-modal-sheet'
import type { PaymentItem, DeductionItem } from '@/types/payroll'
import { PAYMENT_ITEM_CODES, DEDUCTION_ITEM_CODES } from '@/types/payroll'

interface PaymentConditionSheetProps {
  paymentItems: PaymentItem[]
  deductionItems: DeductionItem[]
  onPaymentItemsChange: (items: PaymentItem[]) => void
  onDeductionItemsChange: (items: DeductionItem[]) => void
}

const formatNumber = (value: string) => {
  const num = value.replace(/[^\d]/g, '')
  return num ? Number(num).toLocaleString('ko-KR') : ''
}

const parseNumber = (value: string) => {
  return Number(value.replace(/[^\d]/g, '')) || 0
}

const DEFAULT_PAYMENT_ITEMS: PaymentItem[] = Object.entries(PAYMENT_ITEM_CODES).map(
  ([code, name], index) => ({
    itemCode: code,
    itemOrder: index + 1,
    amount: 0,
    remarks: name,
  }),
)

const DEFAULT_DEDUCTION_ITEMS: DeductionItem[] = Object.entries(DEDUCTION_ITEM_CODES).map(
  ([code, name], index) => ({
    itemCode: code,
    itemOrder: index + 1,
    amount: 0,
    remarks: name,
  }),
)

export default function PaymentConditionSheet({
  paymentItems: externalPaymentItems,
  deductionItems: externalDeductionItems,
  onPaymentItemsChange,
  onDeductionItemsChange,
}: PaymentConditionSheetProps) {
  const paymentConditionSheet = useBottomSheetControler(
    (state) => state.paymentConditionSheet,
  )
  const setPaymentConditionSheet = useBottomSheetControler(
    (state) => state.setPaymentConditionSheet,
  )

  // 로컬 편집 상태
  const [localPaymentItems, setLocalPaymentItems] = useState<PaymentItem[]>(
    externalPaymentItems.length > 0 ? externalPaymentItems : DEFAULT_PAYMENT_ITEMS,
  )
  const [localDeductionItems, setLocalDeductionItems] = useState<DeductionItem[]>(
    externalDeductionItems.length > 0 ? externalDeductionItems : DEFAULT_DEDUCTION_ITEMS,
  )

  // 시트 열릴 때 외부 데이터로 리셋 (이벤트 핸들러 — React Compiler 안전)
  const handleOpenStart = () => {
    setLocalPaymentItems(
      externalPaymentItems.length > 0 ? externalPaymentItems : DEFAULT_PAYMENT_ITEMS,
    )
    setLocalDeductionItems(
      externalDeductionItems.length > 0 ? externalDeductionItems : DEFAULT_DEDUCTION_ITEMS,
    )
  }

  const totalPayment = localPaymentItems.reduce((sum, item) => sum + (item.amount || 0), 0)
  const totalDeduction = localDeductionItems.reduce((sum, item) => sum + (item.amount || 0), 0)
  const actualPayment = totalPayment - totalDeduction

  const handleClose = () => {
    setPaymentConditionSheet(false)
  }

  const handlePaymentAmountChange = (index: number, value: string) => {
    const updated = [...localPaymentItems]
    updated[index] = { ...updated[index], amount: parseNumber(value) }
    setLocalPaymentItems(updated)
  }

  const handleDeductionAmountChange = (index: number, value: string) => {
    const updated = [...localDeductionItems]
    updated[index] = { ...updated[index], amount: parseNumber(value) }
    setLocalDeductionItems(updated)
  }

  const handleSave = () => {
    onPaymentItemsChange(localPaymentItems)
    onDeductionItemsChange(localDeductionItems)
    handleClose()
  }

  const handleReset = () => {
    setLocalPaymentItems(DEFAULT_PAYMENT_ITEMS)
    setLocalDeductionItems(DEFAULT_DEDUCTION_ITEMS)
  }

  return (
    <Sheet
      isOpen={paymentConditionSheet}
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
              <h3>급여 지급 조건</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="sheet-data-wrap">
                <table className="payment-table">
                  <thead>
                    <tr>
                      <th>지급항목</th>
                      <th>공제항목</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="payment-data-list">
                          {localPaymentItems.map((item, index) => (
                            <div className="payment-data-item" key={item.itemCode}>
                              <div className="payment-data-item-tit">
                                {item.remarks || PAYMENT_ITEM_CODES[item.itemCode as keyof typeof PAYMENT_ITEM_CODES] || item.itemCode}
                                {item.itemCode === 'BASIC' && (
                                  <span className="imp"> *</span>
                                )}
                              </div>
                              <div className="payment-data-item-value">
                                <input
                                  type="text"
                                  className="input-frame al-r"
                                  inputMode="numeric"
                                  value={item.amount ? formatNumber(String(item.amount)) : ''}
                                  onChange={(e) =>
                                    handlePaymentAmountChange(index, e.target.value)
                                  }
                                  placeholder="0"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="payment-data-list">
                          {localDeductionItems.map((item, index) => (
                            <div className="payment-data-item" key={item.itemCode}>
                              <div className="payment-data-item-tit">
                                {item.remarks || DEDUCTION_ITEM_CODES[item.itemCode as keyof typeof DEDUCTION_ITEM_CODES] || item.itemCode}
                              </div>
                              <div className="payment-data-item-value">
                                <input
                                  type="text"
                                  className="input-frame al-r"
                                  inputMode="numeric"
                                  value={item.amount ? formatNumber(String(item.amount)) : ''}
                                  onChange={(e) =>
                                    handleDeductionAmountChange(index, e.target.value)
                                  }
                                  placeholder="0"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                    <tr className="total">
                      <td>
                        <div className="payment-td-total">
                          <div className="payment-td-total-tit">지급총액 (+)</div>
                          <div className="payment-td-total-val">
                            {totalPayment.toLocaleString('ko-KR')} 원
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="payment-td-total">
                          <div className="payment-td-total-tit">공제총액 (-)</div>
                          <div className="payment-td-total-val">
                            {totalDeduction.toLocaleString('ko-KR')} 원
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2}>
                        <div className="payment-total">
                          <div className="payment-total-tit">실지급액</div>
                          <div className="payment-total-val">
                            {actualPayment.toLocaleString('ko-KR')}원
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
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
