'use client'
import { useMemo, useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useCommonCodeHierarchy } from '@/hooks/queries/use-common-code-queries'
import { Sheet } from 'react-modal-sheet'
import type { PaymentItem, DeductionItem, BonusItem } from '@/types/payroll'
import { PAYMENT_ITEM_CODES, DEDUCTION_ITEM_CODES } from '@/types/payroll'

interface PaymentConditionSheetProps {
  paymentItems: PaymentItem[]
  deductionItems: DeductionItem[]
  onPaymentItemsChange: (items: PaymentItem[]) => void
  onDeductionItemsChange: (items: DeductionItem[]) => void
  availableBonuses?: BonusItem[]
  onLoadOvertime?: () => void
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
  availableBonuses = [],
  onLoadOvertime,
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
    setLocalPaymentItems(
      externalPaymentItems.length > 0 ? externalPaymentItems : DEFAULT_PAYMENT_ITEMS,
    )
    setLocalDeductionItems(
      externalDeductionItems.length > 0 ? externalDeductionItems : DEFAULT_DEDUCTION_ITEMS,
    )
  }

  // 기본 항목 공통코드 조회 (DPTBS: 지급항목, DDTBS: 공제항목)
  const { data: dptbsCodes = [] } = useCommonCodeHierarchy('DPTBS')
  const { data: ddtbsCodes = [] } = useCommonCodeHierarchy('DDTBS')

  // 기본 항목 코드 (삭제 불가) — enum 코드 + 공통코드 양쪽 호환
  const defaultPaymentCodes = useMemo(() => {
    const codes = new Set(Object.keys(PAYMENT_ITEM_CODES))
    dptbsCodes.forEach((c) => codes.add(c.code))
    return codes
  }, [dptbsCodes])
  const defaultDeductionCodes = useMemo(() => {
    const codes = new Set(Object.keys(DEDUCTION_ITEM_CODES))
    ddtbsCodes.forEach((c) => codes.add(c.code))
    return codes
  }, [ddtbsCodes])

  const handleRemovePaymentItem = (index: number) => {
    setLocalPaymentItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveDeductionItem = (index: number) => {
    setLocalDeductionItems((prev) => prev.filter((_, i) => i !== index))
  }

  // 지급 항목 추가 (salaryInfo.bonuses 기반)
  const [showAddPayment, setShowAddPayment] = useState(false)
  const handleAddPaymentItem = (bonus: BonusItem) => {
    setLocalPaymentItems((prev) => [
      ...prev,
      {
        itemCode: bonus.bonusCode || bonus.bonusType,
        itemOrder: prev.length + 1,
        amount: bonus.amount,
        remarks: bonus.bonusType,
      },
    ])
    setShowAddPayment(false)
  }

  // 추가 공제 항목 공통코드 조회
  const { data: additionalDeductionCodes = [] } = useCommonCodeHierarchy('DDTAD')

  // 공제 항목 추가 (공통코드 선택)
  const [showAddDeduction, setShowAddDeduction] = useState(false)
  const handleAddDeductionItem = (code: string, name: string) => {
    setLocalDeductionItems((prev) => [
      ...prev,
      {
        itemCode: code,
        itemOrder: prev.length + 1,
        amount: 0,
        remarks: name,
      },
    ])
    setShowAddDeduction(false)
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
                            <div className="payment-data-item" key={`${item.itemCode}-${index}`}>
                              <div className="payment-data-item-tit">
                                {item.remarks || PAYMENT_ITEM_CODES[item.itemCode as keyof typeof PAYMENT_ITEM_CODES] || item.itemCode}
                                {item.itemCode === 'BASIC' && (
                                  <span className="imp"> *</span>
                                )}
                              </div>
                              <div className="payment-data-item-value" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  className="input-frame al-r"
                                  inputMode="numeric"
                                  value={item.amount ? formatNumber(String(item.amount)) : ''}
                                  onChange={(e) =>
                                    handlePaymentAmountChange(index, e.target.value)
                                  }
                                  placeholder="0"
                                  style={{ flex: 1 }}
                                />
                                {item.itemCode === 'ADD' && onLoadOvertime && (
                                  <button
                                    type="button"
                                    className="btn-form grey"
                                    onClick={onLoadOvertime}
                                    style={{ whiteSpace: 'nowrap', fontSize: '12px', padding: '6px 10px' }}
                                  >
                                    불러오기
                                  </button>
                                )}
                                {!defaultPaymentCodes.has(item.itemCode) && (
                                  <button
                                    type="button"
                                    className="btn-form grey"
                                    onClick={() => handleRemovePaymentItem(index)}
                                    style={{ whiteSpace: 'nowrap', fontSize: '12px', padding: '6px 10px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px' }}
                                  >
                                    삭제
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          {availableBonuses.length > 0 && (
                            showAddPayment ? (
                              <div className="payment-data-item">
                                {availableBonuses
                                  .filter((b) => !localPaymentItems.some((p) => p.itemCode === (b.bonusCode || b.bonusType)))
                                  .map((b, i) => (
                                    <button
                                      key={b.bonusCode ?? i}
                                      type="button"
                                      className="btn-form grey"
                                      onClick={() => handleAddPaymentItem(b)}
                                      style={{ width: '100%', fontSize: '13px', marginBottom: '4px', textAlign: 'left' }}
                                    >
                                      {b.bonusType} ({b.amount.toLocaleString('ko-KR')}원)
                                    </button>
                                  ))}
                                {availableBonuses.filter((b) => !localPaymentItems.some((p) => p.itemCode === (b.bonusCode || b.bonusType))).length === 0 && (
                                  <div style={{ padding: '8px 0', color: '#999', fontSize: '13px' }}>
                                    추가 가능한 지급 항목이 없습니다.
                                  </div>
                                )}
                                <button
                                  type="button"
                                  className="btn-form grey"
                                  onClick={() => setShowAddPayment(false)}
                                  style={{ width: '100%', fontSize: '13px', marginTop: '4px' }}
                                >
                                  취소
                                </button>
                              </div>
                            ) : (
                              <div className="payment-data-item">
                                <button
                                  type="button"
                                  className="btn-form grey"
                                  onClick={() => setShowAddPayment(true)}
                                  style={{ width: '100%', fontSize: '13px' }}
                                >
                                  + 지급 항목 추가
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="payment-data-list">
                          {localDeductionItems.map((item, index) => (
                            <div className="payment-data-item" key={`${item.itemCode}-${index}`}>
                              <div className="payment-data-item-tit">
                                {item.remarks || DEDUCTION_ITEM_CODES[item.itemCode as keyof typeof DEDUCTION_ITEM_CODES] || item.itemCode}
                              </div>
                              <div className="payment-data-item-value" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  className="input-frame al-r"
                                  inputMode="numeric"
                                  value={item.amount ? formatNumber(String(item.amount)) : ''}
                                  onChange={(e) =>
                                    handleDeductionAmountChange(index, e.target.value)
                                  }
                                  placeholder="0"
                                  style={{ flex: 1 }}
                                />
                                {!defaultDeductionCodes.has(item.itemCode) && (
                                  <button
                                    type="button"
                                    className="btn-form grey"
                                    onClick={() => handleRemoveDeductionItem(index)}
                                    style={{ whiteSpace: 'nowrap', fontSize: '12px', padding: '6px 10px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px' }}
                                  >
                                    삭제
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          {showAddDeduction ? (
                            <div className="payment-data-item">
                              {additionalDeductionCodes
                                .filter((c) => c.isActive && !localDeductionItems.some((d) => d.itemCode === c.code))
                                .map((code) => (
                                <button
                                  key={code.id}
                                  type="button"
                                  className="btn-form grey"
                                  onClick={() => handleAddDeductionItem(code.code, code.name)}
                                  style={{ width: '100%', fontSize: '13px', marginBottom: '4px', textAlign: 'left' }}
                                >
                                  {code.name}
                                </button>
                              ))}
                              <button
                                type="button"
                                className="btn-form grey"
                                onClick={() => setShowAddDeduction(false)}
                                style={{ width: '100%', fontSize: '13px', marginTop: '4px' }}
                              >
                                취소
                              </button>
                            </div>
                          ) : (
                            <div className="payment-data-item">
                              <button
                                type="button"
                                className="btn-form grey"
                                onClick={() => setShowAddDeduction(true)}
                                style={{ width: '100%', fontSize: '13px' }}
                              >
                                + 공제 항목 추가
                              </button>
                            </div>
                          )}
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
