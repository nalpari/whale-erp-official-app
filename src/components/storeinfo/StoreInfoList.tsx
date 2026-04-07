"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./css/store-search-btn.scss";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { usePopupControler } from "@/store/usePopupControler";
import { useAuthStore } from "@/store/useAuthStore";
import { useStoreStore } from "@/store/useStoreStore";
import { useStoreInfiniteList } from "@/hooks/queries/use-store-queries";
import { useStoreSearchStore } from "@/store/useStoreSearchStore";
import { checkStoreSubscribe } from "@/lib/api/store";
import { getErrorMessage } from "@/lib/api";
import { EXTERNAL_URLS } from "@/lib/constants";
import { STATUS_MAP, formatDate } from "@/lib/store-utils";

export default function StoreInfoList() {
  const router = useRouter();
  const setStoreSearchSheet = useBottomSheetControler(
    (state) => state.setStoreSearchSheet
  );
  const openAlert = usePopupControler((state) => state.openAlert);

  const authHeadOfficeId = useAuthStore((state) => state.headOfficeId);
  const authFranchiseId = useAuthStore((state) => state.franchiseId);
  const selectedHeadOffice = useStoreStore((state) => state.selectedHeadOffice);
  const selectedStore = useStoreStore((state) => state.selectedStore);

  const headOfficeId = authHeadOfficeId ?? selectedHeadOffice?.id ?? undefined;
  const storeId = selectedStore?.id ?? undefined;

  const status = useStoreSearchStore((s) => s.status);
  const from = useStoreSearchStore((s) => s.from);
  const to = useStoreSearchStore((s) => s.to);
  const hasSearched = useStoreSearchStore((s) => s.hasSearched);

  const params = {
    office: headOfficeId,
    franchise: authFranchiseId ?? undefined,
    store: storeId,
    status: status ?? undefined,
    from: hasSearched ? (from || undefined) : undefined,
    to: hasSearched ? (to || undefined) : undefined,
    size: 50,
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useStoreInfiniteList(params, !!headOfficeId);

  const allStores = data?.pages.flatMap((page) => page.content) ?? [];
  const totalElements = data?.pages[0]?.totalElements ?? 0;

  // 무한 스크롤
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const el = bottomRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const [isChecking, setIsChecking] = useState(false);

  const handleRegister = async () => {
    if (isChecking) return;
    setIsChecking(true);
    try {
      const result = await checkStoreSubscribe();
      if (result.canSave) {
        router.push("/storeinfo/create");
      } else {
        openAlert({
          message: `${result.planName} 회원입니다. 점포를 추가하기 위해서는 회원 등급 업그레이드가 필요합니다.`,
          confirmText: "확인",
          cancelText: "취소",
          onConfirm: () => {
            window.open(EXTERNAL_URLS.RATE_PLAN, "_blank");
          },
        });
      }
    } catch (err) {
      console.error('[StoreInfoList] 구독 조회 실패:', err);
      openAlert({ message: getErrorMessage(err, "구독 정보를 확인할 수 없습니다.") });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="container">
      <div className="sub-tit-wrap">
        <div className="sub-tit">점포정보 관리</div>
        <div className="sub-btn-wrap">
          <button
            className="btn-s black"
            onClick={handleRegister}
          >
            등록
          </button>
        </div>
      </div>
      <div className="sub-content-body">
        <div className="search-bx">
          <div className="search-count">
            검색결과 <span>{totalElements}건</span>
          </div>
          <button className={`search-btn${hasSearched ? " filtered" : ""}`} onClick={() => setStoreSearchSheet(true)}>
            <i className="icon-search"></i>
            <span>검색</span>
          </button>
        </div>
        <div className="sub-cont-wrap">
          {/* TODO: 공통 로딩 화면으로 교체 (목록 조회) */}
          {isLoading ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#999" }}>
              불러오는 중...
            </div>
          ) : isError ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#e74c3c" }}>
              점포 목록을 불러올 수 없습니다.
            </div>
          ) : allStores.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#999" }}>
              등록된 점포가 없습니다.
            </div>
          ) : (
            allStores.map((store) => {
              const itemStatus = STATUS_MAP[store.operationStatus] ?? {
                label: store.operationStatus,
                className: "badge grey",
              };
              return (
                <button
                  className="sub-item-bx"
                  key={store.id}
                  onClick={() => router.push(`/storeinfo/${store.id}`)}
                >
                  <div className="store-list-name">{store.storeName}</div>
                  <table className="info-table">
                    <colgroup>
                      <col style={{ width: "75px" }} />
                      <col />
                    </colgroup>
                    <tbody>
                      <tr>
                        <th>운영여부</th>
                        <td>
                          <span className={itemStatus.className}>{itemStatus.label}</span>
                        </td>
                      </tr>
                      {store.officeName && (
                        <tr>
                          <th>본사</th>
                          <td>{store.officeName}</td>
                        </tr>
                      )}
                      <tr>
                        <th>가맹점</th>
                        <td>{store.franchiseName || "-"}</td>
                      </tr>
                      <tr>
                        <th>등록일</th>
                        <td>{formatDate(store.createdAt)}</td>
                      </tr>
                    </tbody>
                  </table>
                </button>
              );
            })
          )}
          {hasNextPage && (
            <div ref={bottomRef} style={{ padding: "20px 0", textAlign: "center", color: "#999" }}>
              {isFetchingNextPage && "불러오는 중..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
