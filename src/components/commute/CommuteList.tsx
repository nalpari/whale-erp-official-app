"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "@/components/storeinfo/css/store-search-btn.scss";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { useCommuteSearchStore } from "@/store/useCommuteSearchStore";
import { useStoreStore } from "@/store/useStoreStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useAttendanceInfiniteList } from "@/hooks/queries/use-commute-queries";
import type { AttendanceListItem } from "@/types/commute";
import { getAvatarSrc } from "@/lib/commute-utils";

function AttendanceCard({ item }: { item: AttendanceListItem }) {
  const router = useRouter();

  return (
    <div className="staff-list-item">
      <div className="staff-item-header">
        <div className="head-staff-info">
          <div className="staff-icon">
            <Image
              src={getAvatarSrc(item.iconType)}
              alt="staff-icon"
              width={46}
              height={46}
            />
          </div>
          <div className="staff-info-data">
            <div className="staff-name">
              <span>{item.employeeName ?? "-"}</span>
            </div>
            <div className="staff-job">
              {[item.employeeClassify, item.workDay.join("·"), item.workStatus]
                .filter(Boolean)
                .join("/")}
            </div>
          </div>
        </div>
      </div>
      <button
        className="sub-item-bx"
        onClick={() => router.push(`/commute/${item.employeeId}`)}
      >
        <table className="info-table">
          <colgroup>
            <col style={{ width: "90px" }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>계약분류</th>
              <td>{item.contractClassify ?? "-"}</td>
            </tr>
            {item.officeName && (
              <tr>
                <th>본사</th>
                <td>{item.officeName}</td>
              </tr>
            )}
            {item.franchiseName && (
              <tr>
                <th>가맹점</th>
                <td>
                  <div className="ellipsis">{item.franchiseName}</div>
                </td>
              </tr>
            )}
            {item.storeName && (
              <tr>
                <th>점포</th>
                <td>
                  <div className="ellipsis">{item.storeName}</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </button>
    </div>
  );
}

export default function CommuteList() {
  const setCommuteSearchSheet = useBottomSheetControler(
    (state) => state.setCommuteSearchSheet
  );

  const officeId = useStoreStore((s) => s.selectedHeadOffice?.id);
  const storeId = useStoreStore((s) => s.selectedStore?.id);
  const storeFranchiseId = useStoreStore((s) => s.selectedStore?.franchiseId);
  const authFranchiseId = useAuthStore((s) => s.franchiseId);
  const franchiseId = storeFranchiseId ?? authFranchiseId;

  const searchParams = useCommuteSearchStore((s) => s.searchParams);
  const hasSearched = useCommuteSearchStore((s) => s.hasSearched);

  const hasActiveFilter =
    hasSearched &&
    !!(
      searchParams.status ||
      searchParams.employeeName ||
      (searchParams.dayType?.length ?? 0) > 0 ||
      searchParams.employeeClassify ||
      searchParams.contractClassify
    );

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useAttendanceInfiniteList(
    {
      officeId: officeId ?? 0,
      franchiseId: franchiseId ?? undefined,
      storeId,
      ...searchParams,
    },
    !!officeId
  );

  useEffect(() => {
    if (isError) console.error('[CommuteList] 출퇴근 목록 조회 실패:', error)
  }, [isError, error])

  const items = data?.pages.flatMap((page) => page.content) ?? [];
  const totalElements = data?.pages[0]?.totalElements ?? 0;
  const bottomRef = useRef<HTMLDivElement>(null);
  const isFetchingNextPageRef = useRef(isFetchingNextPage);

  useEffect(() => {
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [isFetchingNextPage]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const el = bottomRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPageRef.current) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="container">
      <div className="sub-tit-wrap">
        <div className="sub-tit">출퇴근 현황</div>
      </div>
      <div className="sub-content-body">
        <div className="search-bx staff">
          <div className="search-count">
            {hasSearched ? (
              <>
                검색결과 <span>{totalElements}건</span>
              </>
            ) : (
              <>
                총 <span>{totalElements}건</span>
              </>
            )}
          </div>
          <button
            className={`search-btn act${hasActiveFilter ? " filtered" : ""}`}
            onClick={() => setCommuteSearchSheet(true)}
          >
            <i className="icon-search"></i>
            <span>검색</span>
          </button>
        </div>

        {!officeId ? (
          <div className="empty-data">점포를 선택해주세요.</div>
        ) : isLoading ? (
          <div className="loading-wrap">
            <div className="loading">불러오는 중...</div>
          </div>
        ) : isError ? (
          <div className="empty-data">
            <div>데이터를 불러오지 못했습니다.</div>
            <button
              className="btn-form grey"
              onClick={() => void refetch()}
            >
              다시 시도
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-data">출퇴근 현황이 없습니다.</div>
        ) : (
          <div className="staff-list-wrap">
            {items.map((item) => (
              <AttendanceCard key={item.contractId} item={item} />
            ))}
            {hasNextPage && (
              <div
                ref={bottomRef}
                style={{ padding: "20px 0", textAlign: "center", color: "#999" }}
              >
                {isFetchingNextPage && "불러오는 중..."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
