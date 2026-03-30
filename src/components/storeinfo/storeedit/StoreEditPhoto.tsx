"use client";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useStoreFormStore } from "@/store/useStoreFormStore";
import { usePopupControler } from "@/store/usePopupControler";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useStoreDetail, useUpdateStore } from "@/hooks/queries/use-store-queries";
import { getErrorMessage } from "@/lib/api";
import StoreForm03 from "../storeform/StoreForm03";

export default function StoreEditPhoto({ id }: { id: number }) {
  const router = useRouter();
  const openAlert = usePopupControler((state) => state.openAlert);
  const updateMutation = useUpdateStore();
  const form = useStoreFormStore();
  const setField = useStoreFormStore((state) => state.setField);
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
    setTitle("점포 사진 수정");
    setOnBack(handleBackConfirm);

    return () => {
      setTitle("");
      setOnBack(null);
    };
  }, [setTitle, setOnBack, handleBackConfirm]);

  // 기존 이미지 데이터로 폼 초기화
  useEffect(() => {
    if (!data) return;
    setField("existingImages",
      data.files
        .filter((f) => f.uploadFileCategory === "STORE_IMAGE")
        .map((f) => ({ id: f.id, originalFileName: f.originalFileName, publicUrl: f.publicUrl || "" }))
    );
    setField("storeImages", []);
    setField("deleteImageIds", []);
  }, [data, setField]);

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
          operatingHours: data.operating.map((o) => ({
            dayType: o.dayType,
            isOperating: o.isOperating,
            openTime: o.openTime,
            closeTime: o.closeTime,
            breakStartTime: o.breakStartTime,
            breakEndTime: o.breakEndTime,
          })),
        },
        deleteImages: form.deleteImageIds.length > 0 ? form.deleteImageIds : undefined,
        storeImages: form.storeImages.length > 0 ? form.storeImages : undefined,
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
          <StoreForm03 />
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
