'use client'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { Sheet } from 'react-modal-sheet'

export default function DeductionAddSheet() {
  const deductionAddSheet = useBottomSheetControler(
    (state) => state.deductionAddSheet,
  )
  const setDeductionAddSheet = useBottomSheetControler(
    (state) => state.setDeductionAddSheet,
  )

  const handleClose = () => {
    setDeductionAddSheet(false)
  }

  return (
    <Sheet
      isOpen={deductionAddSheet}
      onClose={handleClose}
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
            <div className=" bottom-sheet-body">
              <div className="s-txt mt15">
                ※ 정확한 급여 계산을 위해 <b>근무기간을 반드시 입력</b>해
                주세요. <b>4대보험 대상자에 한해 공제액을 입력</b>하며, 저장 시
                급여 내역이 자동으로 계산됩니다.
              </div>
              <div className="sheet-data-wrap">
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    근무기간 <span className="imp">*</span>
                  </div>
                  <div className="flex g8">
                    <div className="date-picker-custom">
                      <input
                        type="text"
                        className="date-picker-input"
                        defaultValue="2025.10.28"
                      />
                    </div>
                    <span>~</span>
                    <div className="date-picker-custom">
                      <input
                        type="text"
                        className="date-picker-input"
                        defaultValue="2025.10.28"
                      />
                    </div>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">국민연금</div>
                  <div className="block">
                    <input type="text" className="input-frame" />
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">건강보험</div>
                  <div className="block">
                    <input type="text" className="input-frame" />
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">고용보험</div>
                  <div className="block">
                    <input type="text" className="input-frame" />
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">장기요양보험</div>
                  <div className="block">
                    <input type="text" className="input-frame" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky">초기화</button>
              <button className="btn-form blue">저장</button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  )
}
