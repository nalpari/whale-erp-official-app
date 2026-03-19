"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { Sheet } from "react-modal-sheet";

export default function WorkerSearchSheet() {
  const workerSearchSheet = useBottomSheetControler(
    (state) => state.workerSearchSheet
  );
  const setWorkerSearchSheet = useBottomSheetControler(
    (state) => state.setWorkerSearchSheet
  );

  const handleClose = () => {
    setWorkerSearchSheet(false);
  };

  return (
    <Sheet
      isOpen={workerSearchSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>검색조건</h3>
            </div>
            <div className=" bottom-sheet-body">
              <div className="sheet-data-wrap">
                <div className="sheet-data-filed">
                  <div className="filed-tit">직원명</div>
                  <div className="block">
                    <select name="" id="" className="select-form">
                      <option value="1">본사 정직원</option>
                    </select>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">임시 근무자명</div>
                  <div className="block">
                    <input type="text" className="input-frame" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky">초기화</button>
              <button className="btn-form blue">검색</button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
}
