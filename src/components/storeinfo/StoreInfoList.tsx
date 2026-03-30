"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./css/store-search-btn.scss";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { usePopupControler } from "@/store/usePopupControler";
import { useAuthStore } from "@/store/useAuthStore";
import { useStoreStore } from "@/store/useStoreStore";
import { useStoreList, useAuthorityDetail } from "@/hooks/queries/use-store-queries";
import { useStoreSearchStore } from "@/store/useStoreSearchStore";
import { checkStoreSubscribe } from "@/lib/api/store";
import type { StoreSearchParams, StoreListItem } from "@/types/store";

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  STOPR_001: { label: "운영", className: "badge blue" },
  STOPR_002: { label: "미운영", className: "badge red" },
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return dateStr.slice(0, 10).replace(/-/g, ".");
}

export default function StoreInfoList() {
  const router = useRouter();
  const setStoreSearchSheet = useBottomSheetControler(
    (state) => state.setStoreSearchSheet
  );
  const openAlert = usePopupControler((state) => state.openAlert);

  const affiliationId = useAuthStore((state) => state.affiliationId);
  const authHeadOfficeId = useAuthStore((state) => state.headOfficeId);
  const authFranchiseId = useAuthStore((state) => state.franchiseId);
  const selectedHeadOffice = useStoreStore((state) => state.selectedHeadOffice);
  const selectedStore = useStoreStore((state) => state.selectedStore);

  const { data: authorityData } = useAuthorityDetail(affiliationId);
  const isBpMaster = authorityData?.is_bp_master ?? false;

  const headOfficeId = authHeadOfficeId ?? selectedHeadOffice?.id ?? undefined;
  const storeId = selectedStore?.id ?? undefined;

  const { status, from, to, hasSearched } = useStoreSearchStore();

  const [page, setPage] = useState(1);
  const [accumulatedStores, setAccumulatedStores] = useState<StoreListItem[]>([]);
  const prevParamsRef = useRef<string>("");

  const params: StoreSearchParams = {
    office: headOfficeId,
    franchise: authFranchiseId ?? undefined,
    store: storeId,
    status: status ?? undefined,
    from: hasSearched ? (from || undefined) : undefined,
    to: hasSearched ? (to || undefined) : undefined,
    page,
    size: 50,
  };

  // 검색 조건 변경 시 페이지/누적 데이터 초기화
  const paramsKey = JSON.stringify({ office: params.office, store: params.store, status: params.status, from: params.from, to: params.to });
  useEffect(() => {
    if (prevParamsRef.current && prevParamsRef.current !== paramsKey) {
      setPage(1);
      setAccumulatedStores([]);
    }
    prevParamsRef.current = paramsKey;
  }, [paramsKey]);

  const { data, isLoading } = useStoreList(params, !!headOfficeId);

  // 데이터 도착 시 누적
  useEffect(() => {
    if (!data?.content) return;
    if (page === 1) {
      setAccumulatedStores(data.content);
    } else {
      setAccumulatedStores((prev) => [...prev, ...data.content]);
    }
  }, [data, page]);

  const totalElements = data?.totalElements ?? 0;
  const hasNext = data?.hasNext ?? false;

  // 무한 스크롤: 하단 감지 요소가 뷰포트에 들어오면 다음 페이지 로드
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!hasNext || isLoading) return;
    const el = bottomRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNext, isLoading]);

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
          // TODO: 업그레이드 페이지 경로 확인 필요
          onConfirm: () => {
            window.open("https://www.whaleerp.co.kr/customer/rate-plan", "_blank");
          },
        });
      }
    } catch {
      openAlert({ message: "구독 정보를 확인할 수 없습니다." });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="container">
      <div className="sub-tit-wrap">
        <div className="sub-tit">점포정보 관리</div>
        <div className="sub-btn-wrap">
          {isBpMaster && (
            <button
              className="btn-s black"
              onClick={handleRegister}
            >
              등록
            </button>
          )}
        </div>
      </div>
      <div className="sub-content-body">
        <div className="search-bx">
          <div className="search-count">
            검색결과 <span>{totalElements}건</span>
          </div>
          <button className={`search-btn act${hasSearched ? " filtered" : ""}`} onClick={() => setStoreSearchSheet(true)}>
            <i className="icon-search"></i>
            <span>검색</span>
          </button>
        </div>
        <div className="sub-cont-wrap">
          {isLoading && page === 1 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#999" }}>
              불러오는 중...
            </div>
          ) : accumulatedStores.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#999" }}>
              등록된 점포가 없습니다.
            </div>
          ) : (
            accumulatedStores.map((store, idx) => {
              const status = STATUS_MAP[store.operationStatus] ?? {
                label: store.operationStatus,
                className: "badge grey",
              };
              return (
                <button
                  className="sub-item-bx"
                  key={`${store.id}-${idx}`}
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
                          <span className={status.className}>{status.label}</span>
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
          {hasNext && (
            <div ref={bottomRef} style={{ padding: "20px 0", textAlign: "center", color: "#999" }}>
              {isLoading && "불러오는 중..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
