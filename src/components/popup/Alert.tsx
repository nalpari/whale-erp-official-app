"use client";
import { useState } from "react";
import { usePopupControler } from "@/store/usePopupControler";

export default function Alert() {
  const setAlertPopup = usePopupControler((state) => state.setAlertPopup);
  const alertMessage = usePopupControler((state) => state.alertMessage);
  const alertConfirmText = usePopupControler((state) => state.alertConfirmText);
  const alertCancelText = usePopupControler((state) => state.alertCancelText);
  const alertOnConfirm = usePopupControler((state) => state.alertOnConfirm);
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      await alertOnConfirm?.();
    } finally {
      setIsPending(false);
      setAlertPopup(false);
    }
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
                  disabled={isPending}
                >
                  {isPending ? "처리 중..." : (alertConfirmText || "확인")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
