"use client";
import { useEffect } from "react";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { useCommuteSearchStore } from "@/store/useCommuteSearchStore";
import { useStoreStore } from "@/store/useStoreStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useCommonCodeHierarchy } from "@/hooks/queries/use-common-code-queries";
import { useEmployeeClassifyOptions } from "@/hooks/queries/use-commute-queries";
import { CONTRACT_CLASS_LABEL } from "@/lib/constants/contract";
import { Sheet } from "react-modal-sheet";

const DAY_TYPE_OPTIONS = [
  { label: "평일", value: "WEEKDAY" },
  { label: "토요일", value: "SATURDAY" },
  { label: "일요일", value: "SUNDAY" },
] as const;

type DayType = "WEEKDAY" | "SATURDAY" | "SUNDAY";

export default function CommuteSearchSheet() {
  const commuteSearchSheet = useBottomSheetControler(
    (state) => state.commuteSearchSheet
  );
  const setCommuteSearchSheet = useBottomSheetControler(
    (state) => state.setCommuteSearchSheet
  );

  const searchParams = useCommuteSearchStore((s) => s.searchParams);
  const { setSearchParams, search, reset } = useCommuteSearchStore.getState();

  const officeId = useStoreStore((s) => s.selectedHeadOffice?.id);
  const storeFranchiseId = useStoreStore((s) => s.selectedStore?.franchiseId);
  const authFranchiseId = useAuthStore((s) => s.franchiseId);
  const franchiseId = storeFranchiseId ?? authFranchiseId;

  const { data: workStatusOptions = [], isError: workStatusError } = useCommonCodeHierarchy("EMPWK");
  const { data: contractOptions = [], isError: contractError } = useCommonCodeHierarchy("CNTCFWK");
  const { data: employeeClassifyOptions = [], isError: classifyError } = useEmployeeClassifyOptions(
    officeId,
    franchiseId ?? undefined
  );

  useEffect(() => {
    if (workStatusError) console.warn('[CommuteSearchSheet] 근무여부 옵션 로딩 실패')
    if (contractError) console.warn('[CommuteSearchSheet] 계약분류 옵션 로딩 실패')
    if (classifyError) console.warn('[CommuteSearchSheet] 직원분류 옵션 로딩 실패')
  }, [workStatusError, contractError, classifyError])

  const handleClose = () => setCommuteSearchSheet(false);

  const handleSearch = () => {
    search();
    handleClose();
  };

  const handleReset = () => reset();

  const toggleDayType = (value: DayType) => {
    const current = searchParams.dayType ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setSearchParams({ dayType: next.length > 0 ? next : undefined });
  };

  return (
    <Sheet
      isOpen={commuteSearchSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>검색조건</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="sheet-data-wrap">
                {/* 근무여부 */}
                <div className="sheet-data-filed">
                  <div className="filed-tit">근무여부</div>
                  <div className="flex g8">
                    {workStatusOptions.map((opt) => (
                      <button
                        key={opt.code}
                        className={`radio-btn block${searchParams.status === opt.code ? " act" : ""}`}
                        onClick={() =>
                          setSearchParams({
                            status:
                              searchParams.status === opt.code
                                ? undefined
                                : opt.code,
                          })
                        }
                      >
                        {opt.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 직원명 */}
                <div className="sheet-data-filed">
                  <div className="filed-tit">직원명</div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      value={searchParams.employeeName ?? ""}
                      onChange={(e) =>
                        setSearchParams({
                          employeeName: e.target.value || undefined,
                        })
                      }
                    />
                  </div>
                </div>

                {/* 근무요일 */}
                <div className="sheet-data-filed">
                  <div className="filed-tit">근무요일</div>
                  <div className="flex g8">
                    {DAY_TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        className={`radio-btn block${(searchParams.dayType ?? []).includes(opt.value) ? " act" : ""}`}
                        onClick={() => toggleDayType(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 직원 분류 */}
                <div className="sheet-data-filed">
                  <div className="filed-tit">직원 분류</div>
                  <div className="block">
                    <select
                      className="select-form"
                      value={searchParams.employeeClassify ?? ""}
                      disabled={!officeId}
                      onChange={(e) =>
                        setSearchParams({
                          employeeClassify: e.target.value || undefined,
                        })
                      }
                    >
                      <option value="">전체</option>
                      {employeeClassifyOptions.map((opt) => (
                        <option key={opt.code} value={opt.code}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 계약 분류 */}
                {/*
                 * 계약 분류 selectbox는 라벨 기준 중복 제거하여 정직원/파트타이머만 표시.
                 * CNTCFWK_001(포괄제), CNTCFWK_002(비포괄제)는 모두 "정직원"으로 라벨링되며
                 * 백엔드에서 둘 중 하나의 코드만 전달해도 두 계약 유형이 모두 검색됨.
                 * 중복 라벨 제거 후 첫 번째 코드(CNTCFWK_001)만 사용.
                 */}
                <div className="sheet-data-filed">
                  <div className="filed-tit">계약 분류</div>
                  <div className="block">
                    <select
                      className="select-form"
                      value={searchParams.contractClassify ?? ""}
                      onChange={(e) =>
                        setSearchParams({
                          contractClassify: e.target.value || undefined,
                        })
                      }
                    >
                      <option value="">전체</option>
                      {contractOptions
                        .filter(
                          (opt, index, arr) =>
                            arr.findIndex(
                              (o) =>
                                (CONTRACT_CLASS_LABEL[o.code] ?? o.name) ===
                                (CONTRACT_CLASS_LABEL[opt.code] ?? opt.name),
                            ) === index,
                        )
                        .map((opt) => (
                          <option key={opt.code} value={opt.code}>
                            {CONTRACT_CLASS_LABEL[opt.code] ?? opt.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky" onClick={handleReset}>
                초기화
              </button>
              <button className="btn-form blue" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
}
