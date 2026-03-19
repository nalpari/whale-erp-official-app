"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { Sheet } from "react-modal-sheet";

export default function BonusPaySheet() {
  const bonusPaySheet = useBottomSheetControler((state) => state.bonusPaySheet);
  const setBonusPaySheet = useBottomSheetControler(
    (state) => state.setBonusPaySheet
  );

  const handleClose = () => {
    setBonusPaySheet(false);
  };

  return (
    <Sheet
      isOpen={bonusPaySheet}
      onClose={handleClose}
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
            <div className=" bottom-sheet-body">
              <div className="s-txt mt15">※ 월 지급 금액을 입력하세요.</div>
              <div className="sheet-data-wrap">
                <div className="sheet-data-filed">
                  <div className="tit-head">
                    <div className="filed-tit">만근상여(원)</div>
                    <div className="auto-right">
                      <div className="toggle-wrap">
                        <span className="toggle-txt">사용</span>
                        <div className="toggle-btn">
                          <input type="checkbox" id="toggle-btn" />
                          <label
                            className="slider"
                            htmlFor="toggle-btn"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame al-r"
                      defaultValue="15,000"
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
                          <input type="checkbox" id="toggle-btn" />
                          <label
                            className="slider"
                            htmlFor="toggle-btn"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame al-r"
                      defaultValue="15,000"
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
                          <input type="checkbox" id="toggle-btn" />
                          <label
                            className="slider"
                            htmlFor="toggle-btn"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame al-r"
                      defaultValue="15,000"
                    />
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
