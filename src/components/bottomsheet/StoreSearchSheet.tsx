"use client";
import { useState } from "react";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { useStoreSearchStore } from "@/store/useStoreSearchStore";
import { Sheet } from "react-modal-sheet";

export default function StoreSearchSheet() {
  const storeSearchSheet = useBottomSheetControler((state) => state.storeSearchSheet);
  const setStoreSearchSheet = useBottomSheetControler((state) => state.setStoreSearchSheet);
  const searchStore = useStoreSearchStore();

  // 로컬 상태 (시트 내부에서만 관리, 검색 시 글로벌에 반영)
  const [localStatus, setLocalStatus] = useState<string | null>(searchStore.status);
  const [localFrom, setLocalFrom] = useState(searchStore.from);
  const [localTo, setLocalTo] = useState(searchStore.to);

  const currentYear = new Date().getFullYear();
  const defaultFrom = `${currentYear}-01-01`;
  const defaultTo = new Date().toISOString().slice(0, 10);

  const handleOpenStart = () => {
    setLocalStatus(searchStore.status);
    setLocalFrom(searchStore.hasSearched ? searchStore.from : defaultFrom);
    setLocalTo(searchStore.hasSearched ? searchStore.to : defaultTo);
  };

  const handleClose = () => {
    setStoreSearchSheet(false);
  };

  const handleSearch = () => {
    const hasFilter = localStatus !== null || localFrom !== "" || localTo !== "";
    searchStore.setStatus(localStatus);
    searchStore.setFrom(localFrom);
    searchStore.setTo(localTo);
    if (hasFilter) {
      searchStore.search();
    } else {
      searchStore.reset();
    }
    handleClose();
  };

  const handleReset = () => {
    setLocalStatus(null);
    setLocalFrom("");
    setLocalTo("");
  };

  return (
    <Sheet
      isOpen={storeSearchSheet}
      onClose={handleClose}
      onOpenStart={handleOpenStart}
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
                <div className="sheet-data-filed">
                  <div className="filed-tit">운영여부</div>
                  <div className="flex g8">
                    <button
                      className={`radio-btn block ${localStatus === null ? "act" : ""}`}
                      onClick={() => setLocalStatus(null)}
                    >
                      전체
                    </button>
                    <button
                      className={`radio-btn block ${localStatus === "STOPR_001" ? "act" : ""}`}
                      onClick={() => setLocalStatus("STOPR_001")}
                    >
                      운영
                    </button>
                    <button
                      className={`radio-btn block ${localStatus === "STOPR_002" ? "act" : ""}`}
                      onClick={() => setLocalStatus("STOPR_002")}
                    >
                      미운영
                    </button>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">등록일</div>
                  <div className="flex g8">
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={localFrom}
                        onChange={(e) => setLocalFrom(e.target.value)}
                      />
                    </div>
                    <span>~</span>
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={localTo}
                        onChange={(e) => setLocalTo(e.target.value)}
                      />
                    </div>
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
