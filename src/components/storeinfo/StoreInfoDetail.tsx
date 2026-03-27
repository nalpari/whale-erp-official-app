"use client";

import { usePopupControler } from "@/store/usePopupControler";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStoreDetail, useDeleteStore } from "@/hooks/queries/use-store-queries";
import type { OperatingHour } from "@/types/store";

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  STOPR_001: { label: "운영", className: "badge blue" },
  STOPR_002: { label: "미운영", className: "badge red" },
};

const DAY_TYPE_LABEL: Record<string, string> = {
  WEEKDAY: "평일",
  SATURDAY: "토요일",
  SUNDAY: "일요일",
};

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  return dateStr.slice(0, 10).replace(/-/g, ".");
}

function getFileNameAndExt(fileName: string): { name: string; ext: string } {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1) return { name: fileName, ext: "" };
  return { name: fileName.slice(0, lastDot), ext: fileName.slice(lastDot) };
}

function renderOperatingHour(hour: OperatingHour) {
  if (!hour.isOperating) return <span>휴무</span>;
  return (
    <div>
      {hour.weekDayTypes && hour.weekDayTypes.length > 0 && (
        <div>{hour.weekDayTypes.join(", ")}</div>
      )}
      {hour.openTime && hour.closeTime && (
        <div>{hour.openTime} ~ {hour.closeTime}</div>
      )}
      {hour.breakStartTime && hour.breakEndTime && (
        <div>{hour.breakStartTime} ~ {hour.breakEndTime} 브레이크타임</div>
      )}
    </div>
  );
}

export default function StoreInfoDetail({ id }: { id: number }) {
  const router = useRouter();
  const setPhotoPopup = usePopupControler((state) => state.setPhotoPopup);
  const openAlert = usePopupControler((state) => state.openAlert);
  const deleteMutation = useDeleteStore();

  const { data, isLoading } = useStoreDetail(id);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  if (isLoading || !data) {
    return (
      <div className="container sub">
        <div style={{ padding: "40px 0", textAlign: "center", color: "#999" }}>
          불러오는 중...
        </div>
      </div>
    );
  }

  const { storeInfo, operating, files } = data;
  const status = STATUS_MAP[storeInfo.operationStatus] ?? {
    label: storeInfo.operationStatus,
    className: "badge grey",
  };

  const storeImages = files.filter((f) => f.uploadFileCategory === "STORE_IMAGE");

  const handleDelete = () => {
    openAlert({
      message: "해당 점포를 삭제하시겠습니까?",
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          router.push("/storeinfo");
        } catch {
          openAlert({ message: "삭제에 실패했습니다." });
        }
      },
    });
  };

  return (
    <div className="container sub">
      <div className="sub-tit-wrap">
        <div className="sub-tit">
          <span className="sub-tit-code">{storeInfo.storeCode}</span>
          <span>{storeInfo.storeName}</span>
        </div>
        <div className="sub-btn-wrap">
          <button className="btn-s black" onClick={handleDelete}>
            삭제
          </button>
        </div>
      </div>
      <div className="sub-content-body">
        {/* 점포 정보 */}
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-cont-tit-wrap">
              <div className="sub-cont-tit">점포 정보</div>
              <div className="sub-cont-btn-wrap">
                <button
                  className="sub-edit-btn"
                  onClick={() => router.push(`/storeinfo/${id}/edit/store`)}
                ></button>
              </div>
            </div>
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "75px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>본사</th>
                    <td>{storeInfo.officeName}</td>
                  </tr>
                  {storeInfo.franchiseName && (
                    <tr>
                      <th>가맹점</th>
                      <td>{storeInfo.franchiseName}</td>
                    </tr>
                  )}
                  <tr>
                    <th>운영여부</th>
                    <td>
                      <div className="flex g8">
                        <span className={status.className}>{status.label}</span>
                        {storeInfo.statusUpdatedDate && (
                          <span className="sub-txt">
                            변경일 : {formatDate(storeInfo.statusUpdatedDate)}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "113px" }} />
                  <col />
                </colgroup>
                <tbody>
                  {storeInfo.ceoName && (
                    <tr>
                      <th>대표자</th>
                      <td>{storeInfo.ceoName}</td>
                    </tr>
                  )}
                  {storeInfo.businessNumber && (
                    <tr>
                      <th>사업자등록번호</th>
                      <td>{storeInfo.businessNumber}</td>
                    </tr>
                  )}
                  {storeInfo.storeAddress && (
                    <tr>
                      <th>점포주소</th>
                      <td>
                        {storeInfo.storeAddress}
                        {storeInfo.storeAddressDetail && ` ${storeInfo.storeAddressDetail}`}
                      </td>
                    </tr>
                  )}
                  {storeInfo.ceoPhone && (
                    <tr>
                      <th>대표자 연락처</th>
                      <td>{storeInfo.ceoPhone}</td>
                    </tr>
                  )}
                  {storeInfo.storePhone && (
                    <tr>
                      <th>점포 전화번호</th>
                      <td>{storeInfo.storePhone}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 점포 사진 */}
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-cont-tit-wrap">
              <div className="sub-cont-tit">점포 사진</div>
              <div className="sub-cont-btn-wrap">
                <button
                  className="sub-edit-btn"
                  onClick={() => router.push(`/storeinfo/${id}/edit/photo`)}
                ></button>
              </div>
            </div>
            <div className="sub-item-bx">
              {storeImages.length > 0 ? (
                <div className="store-img-list m0">
                  {storeImages.map((file) => {
                    const { name, ext } = getFileNameAndExt(file.originalFileName);
                    return (
                      <div className="store-img-item" key={file.id}>
                        <div className="store-img-tit">
                          <span className="img-tit">{name}</span>
                          <span>{ext}</span>
                        </div>
                        <div className="store-img-btn-wrap">
                          <button
                            className="img-show"
                            onClick={() => setPhotoPopup(true)}
                          ></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="store-img-empty">
                  <div className="s-txt">등록된 이미지가 없습니다.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 영업시간 */}
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-cont-tit-wrap">
              <div className="sub-cont-tit">영업시간</div>
              <div className="sub-cont-btn-wrap">
                <button
                  className="sub-edit-btn"
                  onClick={() => router.push(`/storeinfo/${id}/edit/time`)}
                ></button>
              </div>
            </div>
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "75px" }} />
                  <col />
                </colgroup>
                <tbody>
                  {operating.map((hour) => (
                    <tr key={hour.dayType}>
                      <th>{DAY_TYPE_LABEL[hour.dayType] ?? hour.dayType}</th>
                      <td>{renderOperatingHour(hour)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
