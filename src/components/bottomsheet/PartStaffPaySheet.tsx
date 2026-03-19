"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { Sheet } from "react-modal-sheet";

export default function PartStaffPaySheet() {
  const partStaffPaySheet = useBottomSheetControler(
    (state) => state.partStaffPaySheet
  );
  const setPartStaffPaySheet = useBottomSheetControler(
    (state) => state.setPartStaffPaySheet
  );

  const handleClose = () => {
    setPartStaffPaySheet(false);
  };

  return (
    <Sheet
      isOpen={partStaffPaySheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>파트타임 시급 설정</h3>
            </div>
            <div className=" bottom-sheet-body">
              <div className="sheet-data-wrap">
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    평일시급(원) <span className="imp">*</span>
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
                  <div className="filed-tit">
                    연장근무 시급(원) <span className="imp">*</span>
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
                  <div className="filed-tit">
                    휴일근무 시급(원) <span className="imp">*</span>
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
