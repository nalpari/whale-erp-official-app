"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useStoreFormStore } from "@/store/useStoreFormStore";
import { usePopupControler } from "@/store/usePopupControler";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useCreateStore } from "@/hooks/queries/use-store-queries";
import { getErrorMessage, getErrorDetails, isInterceptorHandled } from "@/lib/api";
import { buildOperatingHoursRequest, getOrganizationId, getStoreErrorStep, formatErrorDetails, isValidBusinessNumber, isValidPhoneNumber } from "@/lib/store-utils";
import StoreBasicInfoForm from "./storeform/StoreBasicInfoForm";
import StoreContactForm from "./storeform/StoreContactForm";
import StorePhotoForm from "./storeform/StorePhotoForm";
import StoreOperatingHourForm from "./storeform/StoreOperatingHourForm";

export default function StoreCreate() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const openAlert = usePopupControler((state) => state.openAlert);
  // TODO: 공통 로딩 화면으로 교체 (등록 pending)
  const { mutateAsync: createStore, isPending: isCreating } = useCreateStore();
  const resetForm = useStoreFormStore((state) => state.reset);

  const setTitle = useHeaderStore((state) => state.setTitle);
  const setRightLabel = useHeaderStore((state) => state.setRightLabel);
  const setOnBack = useHeaderStore((state) => state.setOnBack);

  // 진입 시 폼 초기화
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  // 헤더 설정: 타이틀 + 뒤로가기 confirm
  const handleBackConfirm = useCallback(() => {
    openAlert({
      message: "점포 정보 등록을 취소하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => router.back(),
    });
  }, [openAlert, router]);

  useEffect(() => {
    setTitle("점포정보 등록");
    setOnBack(handleBackConfirm);

    return () => {
      setTitle("");
      setRightLabel("");
      setOnBack(null);
    };
  }, [setTitle, setRightLabel, setOnBack, handleBackConfirm]);

  // 헤더 페이지네이션 업데이트
  useEffect(() => {
    setRightLabel(`${step}/4`);
  }, [step, setRightLabel]);

  // Step별 필수값 검증
  const validateStep = (s: number): boolean => {
    const state = useStoreFormStore.getState();
    switch (s) {
      case 1:
        if (state.storeOwner === "FRANCHISE" && !state.franchiseId) return false;
        return !!state.officeId && !!state.storeName;
      case 2:
        if (!state.ceoName || !state.businessNumber || !state.storeAddress || !state.ceoPhone) return false;
        if (!isValidBusinessNumber(state.businessNumber)) return false;
        if (!isValidPhoneNumber(state.ceoPhone)) return false;
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      setSubmitted(true);
      return;
    }
    setSubmitted(false);
    window.scrollTo({ top: 0 });
    setStep(step + 1);
  };

  const handlePrev = () => {
    setSubmitted(false);
    window.scrollTo({ top: 0 });
    setStep(step - 1);
  };

  const handleSave = async () => {
    if (isCreating) return;
    const form = useStoreFormStore.getState();

    if (!form.officeId || !form.storeName) {
      openAlert({ message: "필수 입력 항목을 확인해주세요." });
      return;
    }
    if (form.storeOwner === "FRANCHISE" && !form.franchiseId) {
      openAlert({ message: "가맹점을 선택해주세요." });
      return;
    }

    try {
      const organizationId = getOrganizationId(form.storeOwner, form.officeId, form.franchiseId);

      await createStore({
        data: {
          storeOwner: form.storeOwner,
          organizationId,
          storeName: form.storeName,
          operationStatus: form.operationStatus,
          ceoName: form.ceoName || null,
          businessNumber: form.businessNumber || null,
          storeAddress: form.storeAddress || null,
          storeAddressDetail: form.storeAddressDetail || null,
          ceoPhone: form.ceoPhone || null,
          storePhone: form.storePhone || null,
          operatingHours: buildOperatingHoursRequest(form.operating),
        },
        storeImages: form.storeImages.length > 0 ? form.storeImages : undefined,
        businessFile: form.businessFile ?? undefined,
      });
      openAlert({
        message: "점포가 등록되었습니다.",
        onConfirm: () => router.push("/storeinfo"),
      });
    } catch (err) {
      if (isInterceptorHandled(err)) return;
      console.error('[StoreCreate] 점포 등록 실패:', err);

      const details = getErrorDetails(err);
      if (details) {
        const targetStep = getStoreErrorStep(details);
        if (targetStep !== null) {
          setStep(targetStep);
          window.scrollTo({ top: 0 });
        }
        openAlert({ message: formatErrorDetails(details) });
        return;
      }

      openAlert({ message: getErrorMessage(err, "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.") });
    }
  };

  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          {step === 1 && <StoreBasicInfoForm submitted={submitted} />}
          {step === 2 && <StoreContactForm submitted={submitted} />}
          {step === 3 && <StorePhotoForm />}
          {step === 4 && <StoreOperatingHourForm />}
        </div>
      </div>
      <div className="content-pagination">
        {step === 4 && (
          <div className="mb25">
            <button
              className="btn-form block blue"
              onClick={handleSave}
              disabled={isCreating}
            >
              {isCreating ? "저장 중..." : "저장"}
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
