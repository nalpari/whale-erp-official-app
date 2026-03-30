"use client";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useStoreFormStore } from "@/store/useStoreFormStore";
import { usePopupControler } from "@/store/usePopupControler";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useStoreDetail, useUpdateStore } from "@/hooks/queries/use-store-queries";
import { getErrorMessage } from "@/lib/api";
import { buildOperatingHoursRequest, toFormOperating } from "@/lib/store-utils";
import StoreForm04 from "../storeform/StoreForm04";

export default function StoreEditTime({ id }: { id: number }) {
  const router = useRouter();
  const openAlert = usePopupControler((state) => state.openAlert);
  const updateMutation = useUpdateStore();
  const form = useStoreFormStore();
  const { data } = useStoreDetail(id);
  const setTitle = useHeaderStore((state) => state.setTitle);
  const setOnBack = useHeaderStore((state) => state.setOnBack);

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
      setOnBack(null);
    };
  }, [setTitle, setOnBack, handleBackConfirm]);

  // 운영시간 데이터로 폼 초기화 (서버 개별 요일 → 폼 WEEKDAY 구조로 역변환)
  useEffect(() => {
    if (!data) return;
    form.setOperating(toFormOperating(data.operating));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSave = async () => {
    if (updateMutation.isPending || !data) return;

    try {
      const orgId = data.storeInfo.franchiseId ?? data.storeInfo.officeId;

      await updateMutation.mutateAsync({
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
      openAlert({ message: getErrorMessage(err, "저장에 실패했습니다.") });
    }
  };

  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          <StoreForm04 />
        </div>
      </div>
      <div className="content-pagination">
        <button
          className="btn-form block blue"
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "저장 중..." : "저장"}
        </button>
      </div>
    </>
  );
}
