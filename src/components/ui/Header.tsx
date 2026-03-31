"use client";

import { usePathname, useRouter } from "next/navigation";
import StoreSelect from "./StoreSelect";
import { useHeaderStore } from "@/store/useHeaderStore";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const onDelete = useHeaderStore((s) => s.onDelete);
  const onSave = useHeaderStore((s) => s.onSave);

  const segments = pathname.split("/").filter(Boolean);
  const isSubPage = segments.length >= 2;

  const handleBack = () => {
    router.back();
  };

  const getPageTitle = () => {
    if (pathname.startsWith("/fulltimer")) return "정직원 급여명세서 정보";
    if (pathname.startsWith("/contract")) return "근로계약 관리";
    if (pathname === "/todo/new") return "TO-DO 등록";
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
            <h1>{getPageTitle()}</h1>
            {onSave && (
              <button
                className="btn-s black"
                style={{ marginLeft: "auto" }}
                onClick={onSave}
              >
                저장
              </button>
            )}
            {onDelete && !onSave && (
              <button className="btn-delete" onClick={onDelete}></button>
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
