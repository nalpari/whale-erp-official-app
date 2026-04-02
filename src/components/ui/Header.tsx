"use client";

import { usePathname, useRouter } from "next/navigation";
import StoreSelect from "./StoreSelect";
import { useHeaderStore } from "@/store/useHeaderStore";
import "./css/header-right-label.scss";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const title = useHeaderStore((s) => s.title);
  const onDelete = useHeaderStore((s) => s.onDelete);
  const showDeleteButton = useHeaderStore((s) => s.showDeleteButton);
  const rightLabel = useHeaderStore((s) => s.rightLabel);
  const onBack = useHeaderStore((s) => s.onBack);
  const onSave = useHeaderStore((s) => s.onSave);

  const segments = pathname.split("/").filter(Boolean);
  const isSubPage = segments.length >= 2;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const getPageTitle = () => {
    if (pathname.startsWith("/fulltimer")) return "정직원 급여명세서 정보";
    if (pathname.startsWith("/parttimer")) return "파트타이머 급여명세서 정보";
    if (pathname.startsWith("/overtime")) return "연장근무 수당명세서";
    if (pathname.startsWith("/contract")) return "근로계약 관리";
    return "서브 페이지 헤더";
  };

  if (pathname.includes("/list") || pathname === "/login") {
    return null;
  }

  if (isSubPage || pathname === "/changepw") {
    return (
      <header className="header sub">
        <div className="header-container">
          <div className="header-inner">
            <button className="btn-back" onClick={handleBack}></button>
            <h1>{title || getPageTitle()}</h1>
            {onSave ? (
              <button
                className="btn-s black"
                style={{ marginLeft: "auto" }}
                onClick={onSave}
              >
                저장
              </button>
            ) : showDeleteButton ? (
              <button className="btn-delete" onClick={() => onDelete?.()}></button>
            ) : rightLabel ? (
              <div className="header-right-label">{rightLabel}</div>
            ) : (
              <div style={{ width: 24 }} />
            )}
          </div>
        </div>
      </header>
    );
  }

  // 기본 Header (메인, 1depth)
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-inner">
          <StoreSelect />
        </div>
      </div>
    </header>
  );
}
