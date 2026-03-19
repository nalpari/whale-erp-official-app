"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { Sheet } from "react-modal-sheet";

export default function StoreSearchSheet() {
  const storeSearchSheet = useBottomSheetControler((state) => state.storeSearchSheet);
  const setStoreSearchSheet = useBottomSheetControler((state) => state.setStoreSearchSheet);

  const handleClose = () => {
    setStoreSearchSheet(false);
  };

  return (
    <Sheet
      isOpen={storeSearchSheet}
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
                  <div className="filed-tit">운영여부</div>
                  <div className="flex g8">
                    <button className=" radio-btn block act">전체</button>
                    <button className=" radio-btn block">운영</button>
                    <button className=" radio-btn block">미운영</button>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">등록일</div>
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
