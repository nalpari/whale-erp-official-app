'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useStaffInviteStore } from '@/store/useStaffInviteStore'
import { Sheet } from 'react-modal-sheet'

export default function BonusPaySheet() {
  const bonusPaySheet = useBottomSheetControler((state) => state.bonusPaySheet)
  const setBonusPaySheet = useBottomSheetControler(
    (state) => state.setBonusPaySheet,
  )

  const [fullAttendance, setFullAttendance] = useState(0)
  const [fullAttendanceOn, setFullAttendanceOn] = useState(false)
  const [positionBonus, setPositionBonus] = useState(0)
  const [positionBonusOn, setPositionBonusOn] = useState(false)
  const [incentive, setIncentive] = useState(0)
  const [incentiveOn, setIncentiveOn] = useState(false)

  const handleClose = () => {
    setBonusPaySheet(false)
  }

  const handleReset = () => {
    setFullAttendance(0)
    setFullAttendanceOn(false)
    setPositionBonus(0)
    setPositionBonusOn(false)
    setIncentive(0)
    setIncentiveOn(false)
  }

  const handleConfirm = () => {
    // 스토어에 상여금 저장
    const bonuses = []
    if (fullAttendanceOn && fullAttendance > 0) {
      bonuses.push({ bonusCode: 'BONUS_FULL_ATTENDANCE', bonusType: '만근상여', amount: fullAttendance, memo: '' })
    }
    if (positionBonusOn && positionBonus > 0) {
      bonuses.push({ bonusCode: 'BONUS_POSITION', bonusType: '직책상여', amount: positionBonus, memo: '' })
    }
    if (incentiveOn && incentive > 0) {
      bonuses.push({ bonusCode: 'BONUS_INCENTIVE', bonusType: '인센티브', amount: incentive, memo: '' })
    }
    useStaffInviteStore.getState().setStepThreeSalary({ bonuses })
    setBonusPaySheet(false)
  }

  const syncFromStore = () => {
    const { bonuses } = useStaffInviteStore.getState().stepThreeSalary
    const fa = bonuses.find((b) => b.bonusType === '만근상여')
    const pb = bonuses.find((b) => b.bonusType === '직책상여')
    const ic = bonuses.find((b) => b.bonusType === '인센티브')
    setFullAttendance(fa?.amount ?? 0)
    setFullAttendanceOn(!!fa)
    setPositionBonus(pb?.amount ?? 0)
    setPositionBonusOn(!!pb)
    setIncentive(ic?.amount ?? 0)
    setIncentiveOn(!!ic)
  }

  return (
    <Sheet
      isOpen={bonusPaySheet}
      onClose={handleClose}
      onOpenEnd={syncFromStore}
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
                <div className="sheet-data-filed">
                  <div className="tit-head">
                    <div className="filed-tit">만근상여(원)</div>
                    <div className="auto-right">
                      <div className="toggle-wrap">
                        <span className="toggle-txt">사용</span>
                        <div className="toggle-btn">
                          <input
                            type="checkbox"
                            className="toggle-input"
                            id="toggle-fullattendance"
                            checked={fullAttendanceOn}
                            onChange={(e) => setFullAttendanceOn(e.target.checked)}
                          />
                          <label
                            className="slider"
                            htmlFor="toggle-fullattendance"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="block">
                    <input
                      type="number"
                      className="input-frame al-r"
                      value={fullAttendance || ''}
                      placeholder="0"
                      disabled={!fullAttendanceOn}
                      onChange={(e) =>
                        setFullAttendance(Math.max(0, Number(e.target.value) || 0))
                      }
                    />
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="tit-head">
                    <div className="filed-tit">직책상여(원)</div>
                    <div className="auto-right">
                      <div className="toggle-wrap">
                        <span className="toggle-txt">사용</span>
                        <div className="toggle-btn">
                          <input
                            type="checkbox"
                            className="toggle-input"
                            id="toggle-positionbonus"
                            checked={positionBonusOn}
                            onChange={(e) => setPositionBonusOn(e.target.checked)}
                          />
                          <label
                            className="slider"
                            htmlFor="toggle-positionbonus"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="block">
                    <input
                      type="number"
                      className="input-frame al-r"
                      value={positionBonus || ''}
                      placeholder="0"
                      disabled={!positionBonusOn}
                      onChange={(e) =>
                        setPositionBonus(Math.max(0, Number(e.target.value) || 0))
                      }
                    />
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="tit-head">
                    <div className="filed-tit">인센티브(원)</div>
                    <div className="auto-right">
                      <div className="toggle-wrap">
                        <span className="toggle-txt">사용</span>
                        <div className="toggle-btn">
                          <input
                            type="checkbox"
                            className="toggle-input"
                            id="toggle-incentive"
                            checked={incentiveOn}
                            onChange={(e) => setIncentiveOn(e.target.checked)}
                          />
                          <label
                            className="slider"
                            htmlFor="toggle-incentive"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="block">
                    <input
                      type="number"
                      className="input-frame al-r"
                      value={incentive || ''}
                      placeholder="0"
                      disabled={!incentiveOn}
                      onChange={(e) =>
                        setIncentive(Math.max(0, Number(e.target.value) || 0))
                      }
                    />
                  </div>
                </div>
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
