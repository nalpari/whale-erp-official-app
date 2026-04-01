"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useStoreFormStore } from "@/store/useStoreFormStore";
import { usePopupControler } from "@/store/usePopupControler";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useStoreDetail, useUpdateStore } from "@/hooks/queries/use-store-queries";
import { getErrorMessage } from "@/lib/api";
import { getOrganizationId } from "@/lib/store-utils";
import StoreBasicInfoForm from "../storeform/StoreBasicInfoForm";
import StoreContactForm from "../storeform/StoreContactForm";

export default function StoreEditInfo({ id }: { id: number }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const openAlert = usePopupControler((state) => state.openAlert);
  const { mutateAsync: updateStore, isPending: isUpdating } = useUpdateStore();
  const setFields = useStoreFormStore((state) => state.setFields);
  const { data, isLoading, isError } = useStoreDetail(id);
  const setTitle = useHeaderStore((state) => state.setTitle);
  const setOnBack = useHeaderStore((state) => state.setOnBack);
  const setRightLabel = useHeaderStore((state) => state.setRightLabel);

  const handleBackConfirm = useCallback(() => {
    openAlert({
      message: "점포정보 수정을 취소하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => router.back(),
    });
  }, [openAlert, router]);

  useEffect(() => {
    setTitle("점포정보 수정");
    setOnBack(handleBackConfirm);

    return () => {
      setTitle("");
      setRightLabel("");
      setOnBack(null);
    };
  }, [setTitle, setRightLabel, setOnBack, handleBackConfirm]);

  useEffect(() => {
    setRightLabel(`${step}/2`);
  }, [step, setRightLabel]);

  // 상세 데이터로 폼 초기화
  useEffect(() => {
    if (!data) return;
    const { storeInfo } = data;
    setFields({
      storeOwner: storeInfo.storeOwner,
      officeId: storeInfo.officeId,
      franchiseId: storeInfo.franchiseId ?? null,
      storeName: storeInfo.storeName,
      operationStatus: storeInfo.operationStatus,
      statusUpdatedDate: storeInfo.statusUpdatedDate ?? "",
      ceoName: storeInfo.ceoName ?? "",
      businessNumber: storeInfo.businessNumber ?? "",
      storeAddress: storeInfo.storeAddress ?? "",
      storeAddressDetail: storeInfo.storeAddressDetail ?? "",
      ceoPhone: storeInfo.ceoPhone ?? "",
      storePhone: storeInfo.storePhone ?? "",
    });
  }, [data, setFields]);

  if (isError) {
    return (
      <div className="container sub">
        <div style={{ padding: "40px 0", textAlign: "center", color: "#e74c3c" }}>
          점포 정보를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="container sub">
        <div style={{ padding: "40px 0", textAlign: "center", color: "#999" }}>
          불러오는 중...
        </div>
      </div>
    );
  }

  const handleNext = () => { window.scrollTo({ top: 0 }); setStep(step + 1); };
  const handlePrev = () => { window.scrollTo({ top: 0 }); setStep(step - 1); };

  const handleSave = async () => {
    if (isUpdating) return;
    const form = useStoreFormStore.getState();

    if (!form.officeId || !form.storeName) {
      openAlert({ message: "필수 입력 항목을 확인해주세요." });
      return;
    }

    try {
      const organizationId = getOrganizationId(form.storeOwner, form.officeId, form.franchiseId);

      await updateStore({
        id,
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
          operatingHours: data?.operating.map((o) => ({
            dayType: o.dayType,
            isOperating: o.isOperating,
            openTime: o.openTime,
            closeTime: o.closeTime,
            breakStartTime: o.breakStartTime,
            breakEndTime: o.breakEndTime,
          })) ?? [],
        },
      });
      openAlert({
        message: "저장되었습니다.",
        onConfirm: () => router.push(`/storeinfo/${id}`),
      });
    } catch (err) {
      console.error('[StoreEditInfo] 점포정보 저장 실패:', err);
      openAlert({ message: getErrorMessage(err, "저장에 실패했습니다.") });
    }
  };

  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          {step === 1 && <StoreBasicInfoForm />}
          {step === 2 && <StoreContactForm />}
        </div>
      </div>
      <div className="content-pagination">
        {step === 2 && (
          <div className="mb25">
            <button
              className="btn-form block blue"
              onClick={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? "저장 중..." : "저장"}
            </button>
          </div>
        )}
        <div className="pagination-wrap">
          <button className="page-btn prev" disabled={step === 1} onClick={handlePrev}>
            <i className="icon-arrow left"></i>
            <span>이전</span>
          </button>
          <div className="page-num">
            <span className="current">{step}</span>
            <span>/</span>
            <span>2</span>
          </div>
          <button className="page-btn next" disabled={step === 2} onClick={handleNext}>
            <span>다음</span>
            <i className="icon-arrow right"></i>
          </button>
        </div>
      </div>
    </>
  );
}
