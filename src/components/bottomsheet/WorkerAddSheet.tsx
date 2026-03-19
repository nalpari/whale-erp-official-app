"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { Sheet } from "react-modal-sheet";

export default function WorkerAddSheet() {
  const workerAddSheet = useBottomSheetControler(
    (state) => state.workerAddSheet
  );
  const setWorkerAddSheet = useBottomSheetControler(
    (state) => state.setWorkerAddSheet
  );

  const handleClose = () => {
    setWorkerAddSheet(false);
  };

  return (
    <Sheet
      isOpen={workerAddSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>근무자 추가</h3>
            </div>
            <div className=" bottom-sheet-body">
              <div className="sheet-data-wrap">
                <div className="sheet-data-filed">
                  <div className="filed-tit">직원명</div>
                  <div className="block">
                    <select name="" id="" className="select-form">
                      <option value="1">김직원</option>
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
                  <div className="warning mt5">
                    기간 선택은 필수 입력 사항입니다.
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    근무시간<span className="imp">*</span>
                  </div>
                  <div className="flex g8">
                    <div className="block">
                      <select name="" id="" className="select-form">
                        <option value="1">09:00</option>
                      </select>
                    </div>
                    <div className="block">
                      <select name="" id="" className="select-form">
                        <option value="1">19:00</option>
                      </select>
                    </div>
                  </div>
                  <div className="warning mt5">
                    근무시간은 필수 입력 사항입니다.
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    휴계시간<span className="imp">*</span>
                  </div>
                  <div className="flex g8">
                    <div className="block">
                      <select name="" id="" className="select-form">
                        <option value="1">09:00</option>
                      </select>
                    </div>
                    <div className="block">
                      <select name="" id="" className="select-form">
                        <option value="1">19:00</option>
                      </select>
                    </div>
                  </div>
                  <div className="warning mt5">
                    휴계시간은 필수 입력 사항입니다.
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky">취소</button>
              <button className="btn-form blue">추가</button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
}
