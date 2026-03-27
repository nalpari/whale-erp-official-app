"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStoreFormStore } from "@/store/useStoreFormStore";
import { usePopupControler } from "@/store/usePopupControler";
import { useCreateStore } from "@/hooks/queries/use-store-queries";
import { getErrorMessage } from "@/lib/api";
import StoreForm01 from "./storeform/StoreForm01";
import StoreForm02 from "./storeform/StoreForm02";
import StoreForm03 from "./storeform/StoreForm03";
import StoreForm04 from "./storeform/StoreForm04";

export default function StoreCreate() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const openAlert = usePopupControler((state) => state.openAlert);
  const createMutation = useCreateStore();
  const form = useStoreFormStore();

  // 진입 시 폼 초기화
  useEffect(() => {
    form.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    window.scrollTo({ top: 0 });
    setStep(step + 1);
  };
  const handlePrev = () => {
    window.scrollTo({ top: 0 });
    setStep(step - 1);
  };

  const handleSave = async () => {
    if (createMutation.isPending) return;

    if (!form.officeId || !form.storeName) {
      openAlert({ message: "필수 입력 항목을 확인해주세요." });
      return;
    }

    try {
      await createMutation.mutateAsync({
        data: {
          storeOwner: form.storeOwner,
          officeId: form.officeId,
          franchiseId: form.franchiseId,
          storeName: form.storeName,
          operationStatus: form.operationStatus,
          statusUpdatedDate: form.statusUpdatedDate || null,
          ceoName: form.ceoName || null,
          businessNumber: form.businessNumber || null,
          storeAddress: form.storeAddress || null,
          storeAddressDetail: form.storeAddressDetail || null,
          ceoPhone: form.ceoPhone || null,
          storePhone: form.storePhone || null,
          operating: form.operating,
        },
        storeImages: form.storeImages.length > 0 ? form.storeImages : undefined,
        businessFile: form.businessFile ?? undefined,
      });
      openAlert({
        message: "점포가 등록되었습니다.",
        onConfirm: () => router.push("/storeinfo"),
      });
    } catch (err) {
      openAlert({ message: getErrorMessage(err, "등록에 실패했습니다.") });
    }
  };

  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          {step === 1 && <StoreForm01 />}
          {step === 2 && <StoreForm02 />}
          {step === 3 && <StoreForm03 />}
          {step === 4 && <StoreForm04 />}
        </div>
      </div>
      <div className="content-pagination">
        {step === 4 && (
          <div className="mb25">
            <button
              className="btn-form block blue"
              onClick={handleSave}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        )}
        <div className="pagination-wrap">
          <button
            className="page-btn prev"
            disabled={step === 1}
            onClick={handlePrev}
          >
            <i className="icon-arrow left"></i>
            <span>이전</span>
          </button>
          <div className="page-num">
            <span className="current">{step}</span>
            <span>/</span>
            <span>4</span>
          </div>
          <button
            className="page-btn next"
            disabled={step === 4}
            onClick={handleNext}
          >
            <span>다음</span>
            <i className="icon-arrow right"></i>
          </button>
        </div>
      </div>
    </>
  );
}
