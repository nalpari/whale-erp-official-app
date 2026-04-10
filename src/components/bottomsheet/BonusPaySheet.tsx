'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useBonusCategories } from '@/hooks/queries/use-payroll-queries'
import { Sheet } from 'react-modal-sheet'

export default function BonusPaySheet() {
  const bonusPaySheet = useBottomSheetControler((s) => s.bonusPaySheet)
  const setBonusPaySheet = useBottomSheetControler((s) => s.setBonusPaySheet)
  const storeData = useBottomSheetControler((s) => s.bonusPayData)
  const storeHeadOfficeId = useBottomSheetControler((s) => s.bonusPayHeadOfficeId)
  const storeFranchiseId = useBottomSheetControler((s) => s.bonusPayFranchiseId)
  const storeOnChange = useBottomSheetControler((s) => s.bonusPayOnChange)

  const { data: bonusCategories = [] } = useBonusCategories(
    storeHeadOfficeId ?? undefined,
    storeFranchiseId ?? undefined,
  )

  const [amounts, setAmounts] = useState<Record<string, number>>({})
  const [toggles, setToggles] = useState<Record<string, boolean>>({})

  const handleClose = () => {
    setBonusPaySheet(false)
  }

  const handleReset = () => {
    setAmounts({})
    setToggles({})
  }

  const handleConfirm = () => {
    const bonuses = bonusCategories
      .filter((cat) => toggles[cat.code] && (amounts[cat.code] ?? 0) > 0)
      .map((cat) => ({
        bonusCode: cat.code,
        bonusType: cat.name,
        amount: amounts[cat.code] ?? 0,
        memo: '',
      }))
    storeOnChange?.(bonuses)
    setBonusPaySheet(false)
  }

  const syncFromStore = () => {
    const newAmounts: Record<string, number> = {}
    const newToggles: Record<string, boolean> = {}
    for (const bonus of storeData) {
      if (bonus.bonusCode) {
        newAmounts[bonus.bonusCode] = bonus.amount ?? 0
        newToggles[bonus.bonusCode] = true
      }
    }
    setAmounts(newAmounts)
    setToggles(newToggles)
  }

  return (
    <Sheet
      isOpen={bonusPaySheet}
      onClose={handleClose}
      onOpenStart={syncFromStore}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>상여금 설정</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="s-txt mt15">※ 월 지급 금액을 입력하세요.</div>
              <div className="sheet-data-wrap">
                {bonusCategories.map((cat) => (
                  <div className="sheet-data-filed" key={cat.code}>
                    <div className="tit-head">
                      <div className="filed-tit">{cat.name}(원)</div>
                      <div className="auto-right">
                        <div className="toggle-wrap">
                          <span className="toggle-txt">사용</span>
                          <div className="toggle-btn">
                            <input
                              type="checkbox"
                              className="toggle-input"
                              id={`toggle-bonus-${cat.code}`}
                              checked={toggles[cat.code] ?? false}
                              onChange={(e) =>
                                setToggles((prev) => ({ ...prev, [cat.code]: e.target.checked }))
                              }
                            />
                            <label
                              className="slider"
                              htmlFor={`toggle-bonus-${cat.code}`}
                            ></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="block">
                      <input
                        type="number"
                        className="input-frame al-r"
                        value={amounts[cat.code] || ''}
                        placeholder="0"
                        disabled={!toggles[cat.code]}
                        onChange={(e) =>
                          setAmounts((prev) => ({
                            ...prev,
                            [cat.code]: Math.max(0, Number(e.target.value) || 0),
                          }))
                        }
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
              <button className="btn-form blue" onClick={handleConfirm}>
                설정 완료
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  )
}
