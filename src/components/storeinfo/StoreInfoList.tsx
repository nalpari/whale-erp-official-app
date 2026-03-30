"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./css/store-search-btn.scss";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { useAuthStore } from "@/store/useAuthStore";
import { useStoreStore } from "@/store/useStoreStore";
import { useStoreList } from "@/hooks/queries/use-store-queries";
import { useStoreSearchStore } from "@/store/useStoreSearchStore";
import type { StoreSearchParams } from "@/types/store";

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

  const authHeadOfficeId = useAuthStore((state) => state.headOfficeId);
  const selectedHeadOffice = useStoreStore((state) => state.selectedHeadOffice);
  const selectedStore = useStoreStore((state) => state.selectedStore);

  const headOfficeId = authHeadOfficeId ?? selectedHeadOffice?.id ?? undefined;
  const storeId = selectedStore?.id ?? undefined;

  const { status, from, to, hasSearched } = useStoreSearchStore();
  const currentYear = new Date().getFullYear();
  const defaultFrom = `${currentYear}-01-01`;
  const defaultTo = new Date().toISOString().slice(0, 10);
  const isFiltered = hasSearched && (status !== null || from !== defaultFrom || to !== defaultTo);

  const [page, setPage] = useState(0);

  const params: StoreSearchParams = {
    office: headOfficeId,
    store: storeId,
    status: status ?? undefined,
    from: from || undefined,
    to: to || undefined,
    page,
    size: 50,
  };

  const { data, isLoading } = useStoreList(params, !!headOfficeId);

  const stores = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const hasNext = data?.hasNext ?? false;

  return (
    <div className="container">
      <div className="sub-tit-wrap">
        <div className="sub-tit">점포정보 관리</div>
        <div className="sub-btn-wrap">
          <button
            className="btn-s black"
            onClick={() => router.push("/storeinfo/create")}
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
          <button className={`search-btn act${isFiltered ? " filtered" : ""}`} onClick={() => setStoreSearchSheet(true)}>
            <i className="icon-search"></i>
            <span>검색</span>
          </button>
        </div>
        <div className="sub-cont-wrap">
          {isLoading ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#999" }}>
              불러오는 중...
            </div>
          ) : stores.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#999" }}>
              등록된 점포가 없습니다.
            </div>
          ) : (
            stores.map((store) => {
              const status = STATUS_MAP[store.operationStatus] ?? {
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
            <button
              className="btn-form block grey"
              style={{ marginTop: 12 }}
              onClick={() => setPage((p) => p + 1)}
            >
              더보기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
