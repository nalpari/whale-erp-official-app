"use client";
import { usePopupControler } from "@/store/usePopupControler";

export default function Alert() {
  const alertOptions = usePopupControler((state) => state.alertOptions);
  const closeAlert = usePopupControler((state) => state.closeAlert);

  const message = alertOptions?.message ?? "";
  const confirmText = alertOptions?.confirmText ?? "확인";
  const cancelText = alertOptions?.cancelText;
  const isConfirm = !!cancelText;

  const handleConfirm = async () => {
    try {
      await alertOptions?.onConfirm?.();
    } catch (err) {
      console.error('[Alert] onConfirm 콜백 실행 실패:', err);
    } finally {
      closeAlert();
    }
  };

  const handleCancel = () => {
    alertOptions?.onCancel?.();
    closeAlert();
  };

  return (
    <div className="modal-popup alert">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">
            <div className="alert-frame">
              <div className="alert-info">
                <span>{message}</span>
              </div>
              <div className="alert-btn flex g8">
                {isConfirm && (
                  <button
                    className="btn-form outline min block"
                    onClick={handleCancel}
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  className="btn-form black min block"
                  onClick={handleConfirm}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
