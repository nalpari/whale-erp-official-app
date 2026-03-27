"use client";
import { usePopupControler } from "@/store/usePopupControler";

export default function Alert() {
  const setAlertPopup = usePopupControler((state) => state.setAlertPopup);
  const alertMessage = usePopupControler((state) => state.alertMessage);
  const alertConfirmText = usePopupControler((state) => state.alertConfirmText);
  const alertCancelText = usePopupControler((state) => state.alertCancelText);
  const alertOnConfirm = usePopupControler((state) => state.alertOnConfirm);

  const handleConfirm = () => {
    alertOnConfirm?.();
    setAlertPopup(false);
  };

  const handleCancel = () => {
    setAlertPopup(false);
  };

  return (
    <div className="modal-popup alert">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">
            <div className="alert-frame">
              <div className="alert-info">
                <span>{alertMessage || "알림"}</span>
              </div>
              <div className="alert-btn flex g8">
                {alertCancelText && (
                  <button
                    className="btn-form outline min block"
                    onClick={handleCancel}
                  >
                    {alertCancelText}
                  </button>
                )}
                <button
                  className="btn-form black min block"
                  onClick={handleConfirm}
                >
                  {alertConfirmText || "확인"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
