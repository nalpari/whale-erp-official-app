"use client";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useStoreFormStore } from "@/store/useStoreFormStore";
import { usePopupControler } from "@/store/usePopupControler";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useStoreDetail, useUpdateStore } from "@/hooks/queries/use-store-queries";
import { buildOperatingHoursRequest, toFormOperating, getOrganizationId } from "@/lib/store-utils";
import StoreOperatingHourForm from "../storeform/StoreOperatingHourForm";

export default function StoreEditTime({ id }: { id: number }) {
  const router = useRouter();
  const openAlert = usePopupControler((state) => state.openAlert);
  // TODO: 공통 로딩 화면으로 교체 (수정 pending)
  const { mutateAsync: updateStore, isPending: isUpdating } = useUpdateStore();
  const setOperating = useStoreFormStore((state) => state.setOperating);
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
    setTitle("영업시간 수정");
    setOnBack(handleBackConfirm);

    return () => {
      setTitle("");
      setRightLabel("");
      setOnBack(null);
    };
  }, [setTitle, setRightLabel, setOnBack, handleBackConfirm]);

  // 운영시간 데이터로 폼 초기화 (서버 개별 요일 → 폼 WEEKDAY 구조로 역변환)
  useEffect(() => {
    if (!data) return;
    setOperating(toFormOperating(data.operating));
  }, [data, setOperating]);

  if (isError) {
    return (
      <div className="container sub">
        <div style={{ padding: "40px 0", textAlign: "center", color: "#e74c3c" }}>
          점포 정보를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  // TODO: 공통 로딩 화면으로 교체 (상세 조회)
  if (isLoading || !data) {
    return (
      <div className="container sub">
        <div style={{ padding: "40px 0", textAlign: "center", color: "#999" }}>
          불러오는 중...
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (isUpdating) return;
    const form = useStoreFormStore.getState();

    try {
      const orgId = getOrganizationId(data.storeInfo.storeOwner, data.storeInfo.officeId, data.storeInfo.franchiseId);

      await updateStore({
        id,
        data: {
          storeOwner: data.storeInfo.storeOwner,
          organizationId: orgId,
          storeName: data.storeInfo.storeName,
          operationStatus: data.storeInfo.operationStatus,
          ceoName: data.storeInfo.ceoName,
          businessNumber: data.storeInfo.businessNumber,
          storeAddress: data.storeInfo.storeAddress,
          storeAddressDetail: data.storeInfo.storeAddressDetail,
          ceoPhone: data.storeInfo.ceoPhone,
          storePhone: data.storeInfo.storePhone,
          operatingHours: buildOperatingHoursRequest(form.operating),
        },
      });
      openAlert({
        message: "저장되었습니다.",
        onConfirm: () => router.push(`/storeinfo/${id}`),
      });
    } catch (err) {
      console.error('[StoreEditTime] 영업시간 저장 실패:', err);
      openAlert({ message: "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
    }
  };

  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          <StoreOperatingHourForm />
        </div>
      </div>
      <div className="content-pagination">
        <button
          className="btn-form block blue"
          onClick={handleSave}
          disabled={isUpdating}
        >
          {isUpdating ? "저장 중..." : "저장"}
        </button>
      </div>
    </>
  );
}
