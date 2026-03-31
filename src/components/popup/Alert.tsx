"use client";
import { useState } from "react";
import { usePopupControler } from "@/store/usePopupControler";

export default function Alert() {
  const alertOptions = usePopupControler((state) => state.alertOptions);
  const closeAlert = usePopupControler((state) => state.closeAlert);

  const message = alertOptions?.message ?? "";
  const confirmText = alertOptions?.confirmText ?? "확인";
  const cancelText = alertOptions?.cancelText;
  const isConfirm = !!cancelText;

  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      await alertOptions?.onConfirm?.();
      closeAlert();
    } catch (err) {
      console.error('[Alert] onConfirm 콜백 실행 실패:', err);
      // 에러 시 팝업을 닫지 않음 — 호출측에서 에러 Alert를 다시 띄울 수 있도록 함
    } finally {
      setIsPending(false);
    }
  };

  const handleCancel = () => {
    try {
      alertOptions?.onCancel?.();
    } catch (err) {
      console.error('[Alert] onCancel 콜백 실행 실패:', err);
    }
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
                  disabled={isPending}
                >
                  {isPending ? "처리 중..." : confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
