"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { Sheet } from "react-modal-sheet";

export default function CommuteSearchSheet() {
  const commuteSearchSheet = useBottomSheetControler(
    (state) => state.commuteSearchSheet
  );
  const setCommuteSearchSheet = useBottomSheetControler(
    (state) => state.setCommuteSearchSheet
  );

  const handleClose = () => {
    setCommuteSearchSheet(false);
  };

  return (
    <Sheet
      isOpen={commuteSearchSheet}
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
                  <div className="filed-tit">근무여부</div>
                  <div className="flex g8">
                    <button className=" radio-btn block act">근무</button>
                    <button className=" radio-btn block">휴직</button>
                    <button className=" radio-btn block">퇴사</button>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">직원명</div>
                  <div className="block">
                    <input type="text" className="input-frame" />
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">근무요일</div>
                  <div className="flex g8">
                    <button className=" radio-btn block act">평일</button>
                    <button className=" radio-btn block">토요일</button>
                    <button className=" radio-btn block">일요일</button>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">직원 분류</div>
                  <div className="block">
                    <select name="" id="" className="select-form">
                      <option value="1">본사 정직원</option>
                    </select>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">계약분류</div>
                  <div className="block">
                    <select name="" id="" className="select-form">
                      <option value="1">본사 정직원</option>
                    </select>
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
