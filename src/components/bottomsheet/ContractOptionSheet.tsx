"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { Sheet } from "react-modal-sheet";

export default function ContractOptionSheet() {
  const contractOptionSheet = useBottomSheetControler(
    (state) => state.contractOptionSheet
  );
  const setContractOptionSheet = useBottomSheetControler(
    (state) => state.setContractOptionSheet
  );

  const handleClose = () => {
    setContractOptionSheet(false);
  };

  return (
    <Sheet
      isOpen={contractOptionSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>계약설정</h3>
            </div>
            <div className=" bottom-sheet-body">
              <div className="sheet-data-wrap">
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    계약년도 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <select name="" id="" className="select-form">
                      <option value="1">2025년</option>
                    </select>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    통상시급(원) <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame al-r"
                      defaultValue="15,000"
                    />
                  </div>
                  <div className="filed-guide">
                    <span>
                      <i>2025년</i> 최저시급은 <i>10,030원</i> 입니다.
                    </span>
                    <span>통상시급은 최저시급 이상으로 설정해야 합니다.</span>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    주 단위 근무시간 입력 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      defaultValue="40"
                    />
                  </div>
                  <div className="filed-guide">
                    <span>하루 8시간 근무 시, 주단위로는 40시간입니다.</span>
                    <span>
                      주당 15시간 이상 근무할 경우, 주휴수당(근무시간/5)을 함께
                      계산합니다.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky">초기화</button>
              <button className="btn-form blue">설정 완료</button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
}
