"use client";

import { usePopupControler } from "@/store/usePopupControler";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import { getErrorMessage, isInterceptorHandled } from "@/lib/api";
import { useStoreDetail, useDeleteStore } from "@/hooks/queries/use-store-queries";
import type { OperatingHour } from "@/types/store";
import { STATUS_MAP, WEEKDAY_LABEL, WEEKDAY_ORDER, ALL_DAYS, formatDate, formatTime, getFileNameAndExt } from "@/lib/store-utils";

/** 개별 요일 엔트리들을 평일/토요일/일요일 + 정기휴일로 그룹핑 */
function groupOperatingHours(operating: OperatingHour[]) {
  const byDay = new Map<string, OperatingHour>();
  for (const h of operating) {
    byDay.set(h.dayType, h);
  }

  // 평일 운영 요일 수집
  const weekdayOperating: string[] = [];
  let weekdayTime: { open: string; close: string } | null = null;
  let weekdayBreak: { start: string; end: string } | null = null;

  for (const day of WEEKDAY_ORDER) {
    const h = byDay.get(day);
    if (h?.isOperating) {
      weekdayOperating.push(day);
      if (!weekdayTime && h.openTime && h.closeTime) {
        weekdayTime = { open: h.openTime, close: h.closeTime };
      }
      if (!weekdayBreak && h.breakStartTime && h.breakEndTime) {
        weekdayBreak = { start: h.breakStartTime, end: h.breakEndTime };
      }
    }
  }

  const saturday = byDay.get("SATURDAY");
  const sunday = byDay.get("SUNDAY");

  // 정기휴일: 운영하지 않는 요일
  const closedDays = ALL_DAYS.filter((d) => {
    const h = byDay.get(d);
    return !h?.isOperating;
  });

  return { weekdayOperating, weekdayTime, weekdayBreak, saturday, sunday, closedDays };
}

export default function StoreInfoDetail({ id }: { id: number }) {
  const router = useRouter();
  const openPhotoPopup = usePopupControler((state) => state.openPhotoPopup);
  const openAlert = usePopupControler((state) => state.openAlert);
  const setTitle = useHeaderStore((state) => state.setTitle);
  const setOnDelete = useHeaderStore((state) => state.setOnDelete);
  const setShowDeleteButton = useHeaderStore((state) => state.setShowDeleteButton);
  const { mutateAsync: deleteStoreAsync } = useDeleteStore();

  const { data, isLoading, isError } = useStoreDetail(id);

  const handleDelete = useCallback(() => {
    openAlert({
      message: "해당 점포를 삭제하시겠습니까?",
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          await deleteStoreAsync(id);
          router.push("/storeinfo");
        } catch (err) {
          if (isInterceptorHandled(err)) return
          console.error('[StoreInfoDetail] 점포 삭제 실패:', err);
          openAlert({ message: getErrorMessage(err, "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.") });
        }
      },
    });
  }, [id, openAlert, deleteStoreAsync, router]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setTitle("점포정보 상세조회");
    setShowDeleteButton(true);

    return () => {
      setTitle("");
      setShowDeleteButton(false);
      setOnDelete(null);
    };
  }, [setTitle, setShowDeleteButton, setOnDelete]);

  useEffect(() => {
    if (data) {
      setOnDelete(handleDelete);
    }
  }, [data, handleDelete, setOnDelete]);

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

  const { storeInfo, operating, files } = data;
  const status = STATUS_MAP[storeInfo.operationStatus] ?? {
    label: storeInfo.operationStatus,
    className: "badge grey",
  };

  const storeImages = files.filter((f) => f.uploadFileCategory === "STORE_IMAGE");
  const imageUrls = storeImages.map((f) => f.publicUrl || "");

  const { weekdayOperating, weekdayTime, weekdayBreak, saturday, sunday, closedDays } =
    groupOperatingHours(operating);

  return (
    <div className="container sub">
      <div className="sub-tit-wrap">
        <div className="sub-tit">
          <span className="sub-tit-code">{storeInfo.storeCode}</span>
          <span>{storeInfo.storeName}</span>
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
                  <tr>
                    <th>가맹점</th>
                    <td>{storeInfo.franchiseName || "-"}</td>
                  </tr>
                  <tr>
                    <th>운영여부</th>
                    <td>
                      <div className="flex g8">
                        <span className={status.className}>{status.label}</span>
                        {storeInfo.statusUpdatedDate && (
                          <span className="sub-txt">
                            운영여부 변경일 : {formatDate(storeInfo.statusUpdatedDate)}
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
                  <tr>
                    <th>점포 전화번호</th>
                    <td>{storeInfo.storePhone || ""}</td>
                  </tr>
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
                  {storeImages.map((file, idx) => {
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
                            onClick={() => openPhotoPopup(imageUrls, idx)}
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
                  {weekdayOperating.length > 0 && (
                    <tr>
                      <th>평일</th>
                      <td>
                        <div>{weekdayOperating.map((d) => WEEKDAY_LABEL[d] ?? d).join(", ")}</div>
                        {weekdayTime && (
                          <div>{formatTime(weekdayTime.open)} ~ {formatTime(weekdayTime.close)}</div>
                        )}
                        {weekdayBreak && (
                          <div>{formatTime(weekdayBreak.start)} ~ {formatTime(weekdayBreak.end)} 브레이크타임</div>
                        )}
                      </td>
                    </tr>
                  )}
                  {saturday?.isOperating && (
                    <tr>
                      <th>토요일</th>
                      <td>
                        {saturday.openTime && saturday.closeTime && (
                          <div>{formatTime(saturday.openTime)} ~ {formatTime(saturday.closeTime)}</div>
                        )}
                        {saturday.breakStartTime && saturday.breakEndTime && (
                          <div>{formatTime(saturday.breakStartTime)} ~ {formatTime(saturday.breakEndTime)} 브레이크타임</div>
                        )}
                      </td>
                    </tr>
                  )}
                  {sunday?.isOperating && (
                    <tr>
                      <th>일요일</th>
                      <td>
                        {sunday.openTime && sunday.closeTime && (
                          <div>{formatTime(sunday.openTime)} ~ {formatTime(sunday.closeTime)}</div>
                        )}
                        {sunday.breakStartTime && sunday.breakEndTime && (
                          <div>{formatTime(sunday.breakStartTime)} ~ {formatTime(sunday.breakEndTime)} 브레이크타임</div>
                        )}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <th>정기휴일</th>
                    <td>
                      {closedDays.length > 0 ? (
                        <div>{closedDays.map((d) => WEEKDAY_LABEL[d] ?? d).join(", ")}</div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
