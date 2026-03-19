"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { usePopupControler } from "@/store/usePopupControler";
import { Sheet } from "react-modal-sheet";

export default function GoToOptionSheet() {
  const goToOptionSheet = useBottomSheetControler((state) => state.goToOptionSheet);
  const setGoToOptionSheet = useBottomSheetControler((state) => state.setGoToOptionSheet);
  const setAlertPopup = usePopupControler((state) => state.setAlertPopup);

  const handleClose = () => {
    setGoToOptionSheet(false);
  };

  const handleSetAlert = () => {
    setAlertPopup(true);
  };

  return (
    <Sheet
      isOpen={goToOptionSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>바로가기 설정</h3>
            </div>
            <div className=" bottom-sheet-body">
              <div className="go-to-option-wrap">
                <div className="go-to-option-item">
                  <div className="go-to-option-tit ">
                    <span>ㄱ</span>~<span>ㄹ</span>
                  </div>
                  <div className="go-to-option-content">
                    <div className="check-form-box">
                      <input type="checkbox" id="acc" name="acc" />
                      <label htmlFor="acc">계정별 현황</label>
                    </div>
                    <div className="check-form-box">
                      <input type="checkbox" id="contract" name="contract" />
                      <label htmlFor="contract">근로계약관리</label>
                    </div>
                  </div>
                </div>
                <div className="go-to-option-item">
                  <div className="go-to-option-tit ">
                    <span>ㅁ</span>~<span>ㅇ</span>
                  </div>
                  <div className="go-to-option-content">
                    <div className="check-form-box">
                      <input
                        type="checkbox"
                        id="workplan-create"
                        name="workplan-create"
                      />
                      <label htmlFor="workplan-create">
                        매장별 근무 계획수립
                      </label>
                    </div>
                    <div className="check-form-box">
                      <input type="checkbox" id="workplan" name="workplan" />
                      <label htmlFor="workplan">매장별 근무 계획표</label>
                    </div>
                    <div className="check-form-box">
                      <input type="checkbox" id="trading" name="trading" />
                      <label htmlFor="trading">매출/매입 거래 등록</label>
                    </div>
                    <div className="check-form-box">
                      <input type="checkbox" id="overtime" name="overtime" />
                      <label htmlFor="overtime">연장근무 수당명</label>
                    </div>
                  </div>
                </div>
                <div className="go-to-option-item">
                  <div className="go-to-option-tit ">
                    <span>ㅈ</span>~<span>ㅋ</span>
                  </div>
                  <div className="go-to-option-content">
                    <div className="check-form-box">
                      <input type="checkbox" id="finance" name="finance" />
                      <label htmlFor="finance">재무현황</label>
                    </div>
                    <div className="check-form-box">
                      <input type="checkbox" id="store" name="store" />
                      <label htmlFor="store">점포정보 관리</label>
                    </div>
                    <div className="check-form-box">
                      <input
                        type="checkbox"
                        id="salary-regular"
                        name="salary-regular"
                      />
                      <label htmlFor="salary-regular">정직원 급여명세서</label>
                    </div>
                    <div className="check-form-box">
                      <input type="checkbox" id="staff" name="staff" />
                      <label htmlFor="staff">직원정보 관리</label>
                    </div>
                    <div className="check-form-box">
                      <input
                        type="checkbox"
                        id="attendance"
                        name="attendance"
                      />
                      <label htmlFor="attendance">출퇴근 현황</label>
                    </div>
                  </div>
                </div>
                <div className="go-to-option-item">
                  <div className="go-to-option-tit ">
                    <span>ㅍ</span>~<span>ㅎ</span>
                  </div>
                  <div className="go-to-option-content">
                    <div className="check-form-box">
                      <input
                        type="checkbox"
                        id="salary-part"
                        name="salary-part"
                      />
                      <label htmlFor="salary-part">파트타이머 급여명세서</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky">초기화</button>
              <button
                className="btn-form blue"
                onClick={handleSetAlert}
              >
                설정
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
}
