"use client";
import { usePopupControler } from "@/store/usePopupControler";

export default function Alert() {
  const setAlertPopup = usePopupControler((state) => state.setAlertPopup);

  const handleClose = () => {
    setAlertPopup(false);
  };

  return (
    <div className="modal-popup alert">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">
            <div className="alert-frame">
              <div className="alert-info">
                <span>바로가기는 최대 4개까지 선택 가능합니다.</span>
              </div>
              <div className="alert-btn flex g8">
                {/* alert 팝업시 취소 버튼 숨김 confirm 팝업시 취소 버튼 노출 */}
                {/* <button
                  className="btn-form outline min block"
                  onClick={handleClose}
                >
                  취소
                </button> */}
                <button
                  className="btn-form black min block"
                  onClick={handleClose}
                >
                  선택
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
