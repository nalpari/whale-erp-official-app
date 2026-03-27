"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStoreFormStore } from "@/store/useStoreFormStore";
import { usePopupControler } from "@/store/usePopupControler";
import { useStoreDetail, useUpdateStore } from "@/hooks/queries/use-store-queries";
import { getErrorMessage } from "@/lib/api";
import StoreForm04 from "../storeform/StoreForm04";

export default function StoreEditTime({ id }: { id: number }) {
  const router = useRouter();
  const openAlert = usePopupControler((state) => state.openAlert);
  const updateMutation = useUpdateStore();
  const form = useStoreFormStore();
  const { data } = useStoreDetail(id);

  // 운영시간 데이터로 폼 초기화
  useEffect(() => {
    if (!data) return;
    form.setOperating(
      data.operating.map((o) => ({
        dayType: o.dayType,
        isOperating: o.isOperating,
        openTime: o.openTime ?? null,
        closeTime: o.closeTime ?? null,
        breakStartTime: o.breakStartTime ?? null,
        breakEndTime: o.breakEndTime ?? null,
        selectWeekDayList: o.weekDayTypes ?? undefined,
      }))
    );
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
          operating: form.operating,
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
