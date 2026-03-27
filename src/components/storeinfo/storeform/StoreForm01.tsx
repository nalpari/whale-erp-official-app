"use client";
import { useMemo } from "react";
import { useStoreFormStore } from "@/store/useStoreFormStore";
import { useBpTree } from "@/hooks/queries/use-bp-queries";

export default function StoreForm01() {
  const {
    storeOwner, officeId, franchiseId, storeName, operationStatus, statusUpdatedDate,
    setField,
  } = useStoreFormStore();

  const { data: bpTree = [] } = useBpTree();

  // 선택된 본사의 가맹점 목록
  const franchises = useMemo(() => {
    if (!officeId) return [];
    const office = bpTree.find((o) => o.id === officeId);
    return office?.franchises ?? [];
  }, [bpTree, officeId]);

  return (
    <div className="sub-cont-wrap">
      <div className="sub-cont-item-wrap">
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              점포소유 <span className="imp">*</span>
            </div>
            <div className="flex g8">
              <button
                className={`radio-btn block ${storeOwner === "HEAD_OFFICE" ? "act" : ""}`}
                onClick={() => {
                  setField("storeOwner", "HEAD_OFFICE");
                  setField("franchiseId", null);
                }}
              >
                본사
              </button>
              <button
                className={`radio-btn block ${storeOwner === "FRANCHISE" ? "act" : ""}`}
                onClick={() => setField("storeOwner", "FRANCHISE")}
              >
                가맹점
              </button>
            </div>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              본사/가맹점 <span className="imp">*</span>
            </div>
            <div>
              <div className="block mb8">
                <select
                  className="select-form"
                  value={officeId ?? ""}
                  onChange={(e) => {
                    setField("officeId", e.target.value ? Number(e.target.value) : null);
                    setField("franchiseId", null);
                  }}
                >
                  <option value="">본사 선택</option>
                  {bpTree.map((office) => (
                    <option key={office.id} value={office.id}>
                      {office.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="block">
                <select
                  className="select-form"
                  value={franchiseId ?? ""}
                  onChange={(e) => setField("franchiseId", e.target.value ? Number(e.target.value) : null)}
                  disabled={storeOwner !== "FRANCHISE" || !officeId}
                >
                  <option value="">가맹점 선택</option>
                  {franchises.map((franchise) => (
                    <option key={franchise.id} value={franchise.id}>
                      {franchise.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              점포명<span className="imp">*</span>
            </div>
            <div className="block">
              <input
                type="text"
                className="input-frame"
                value={storeName}
                onChange={(e) => setField("storeName", e.target.value)}
                placeholder="점포명을 입력하세요"
              />
            </div>
            {!storeName && (
              <div className="warning mt10">* 필수 입력 항목입니다.</div>
            )}
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              운영여부 <span className="imp">*</span>
            </div>
            <div className="flex g8">
              <button
                className={`radio-btn block ${operationStatus === "STOPR_001" ? "act" : ""}`}
                onClick={() => {
                  setField("operationStatus", "STOPR_001");
                  setField("statusUpdatedDate", new Date().toISOString().slice(0, 10));
                }}
              >
                운영
              </button>
              <button
                className={`radio-btn block ${operationStatus === "STOPR_002" ? "act" : ""}`}
                onClick={() => {
                  setField("operationStatus", "STOPR_002");
                  setField("statusUpdatedDate", new Date().toISOString().slice(0, 10));
                }}
              >
                미운영
              </button>
            </div>
            {statusUpdatedDate && (
              <div className="s-txt mt10">
                운영여부 변경일 : {statusUpdatedDate.replace(/-/g, ".")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
