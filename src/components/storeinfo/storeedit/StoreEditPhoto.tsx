"use client";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useStoreFormStore } from "@/store/useStoreFormStore";
import { usePopupControler } from "@/store/usePopupControler";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useStoreDetail, useUpdateStore } from "@/hooks/queries/use-store-queries";
import { getErrorMessage } from "@/lib/api";
import { getOrganizationId } from "@/lib/store-utils";
import StorePhotoForm from "../storeform/StorePhotoForm";

export default function StoreEditPhoto({ id }: { id: number }) {
  const router = useRouter();
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
    setTitle("점포 사진 수정");
    setOnBack(handleBackConfirm);

    return () => {
      setTitle("");
      setRightLabel("");
      setOnBack(null);
    };
  }, [setTitle, setRightLabel, setOnBack, handleBackConfirm]);

  // 기존 이미지 데이터로 폼 초기화
  useEffect(() => {
    if (!data) return;
    setFields({
      existingImages: data.files
        .filter((f) => f.uploadFileCategory === "STORE_IMAGE")
        .map((f) => ({ id: f.id, originalFileName: f.originalFileName, publicUrl: f.publicUrl || "" })),
      storeImages: [],
      deleteImageIds: [],
    });
  }, [data, setFields]);

  if (isLoading || !data) {
    return (
      <div className="container sub">
        <div style={{ padding: "40px 0", textAlign: "center", color: "#999" }}>
          {isError ? "점포 정보를 불러올 수 없습니다." : "불러오는 중..."}
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
      console.error('[StoreEditPhoto] 점포 사진 저장 실패:', err);
      openAlert({ message: getErrorMessage(err, "저장에 실패했습니다.") });
    }
  };

  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          <StorePhotoForm />
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
