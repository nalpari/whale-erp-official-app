"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStoreFormStore } from "@/store/useStoreFormStore";
import { usePopupControler } from "@/store/usePopupControler";
import { useStoreDetail, useUpdateStore } from "@/hooks/queries/use-store-queries";
import { getErrorMessage } from "@/lib/api";
import StoreForm03 from "../storeform/StoreForm03";

export default function StoreEditPhoto({ id }: { id: number }) {
  const router = useRouter();
  const openAlert = usePopupControler((state) => state.openAlert);
  const updateMutation = useUpdateStore();
  const form = useStoreFormStore();
  const { data } = useStoreDetail(id);

  // 기존 이미지 데이터로 폼 초기화
  useEffect(() => {
    if (!data) return;
    form.setField("existingImages",
      data.files
        .filter((f) => f.uploadFileCategory === "STORE_IMAGE")
        .map((f) => ({ id: f.id, originalFileName: f.originalFileName }))
    );
    form.setField("storeImages", []);
    form.setField("deleteImageIds", []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSave = async () => {
    if (updateMutation.isPending || !data) return;

    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          storeOwner: data.storeInfo.storeOwner,
          officeId: data.storeInfo.officeId,
          franchiseId: data.storeInfo.franchiseId,
          storeName: data.storeInfo.storeName,
          operationStatus: data.storeInfo.operationStatus,
          ceoName: data.storeInfo.ceoName,
          businessNumber: data.storeInfo.businessNumber,
          storeAddress: data.storeInfo.storeAddress,
          storeAddressDetail: data.storeInfo.storeAddressDetail,
          ceoPhone: data.storeInfo.ceoPhone,
          storePhone: data.storeInfo.storePhone,
          operating: data.operating.map((o) => ({
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
