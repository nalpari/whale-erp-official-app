"use client";

import { usePathname, useRouter } from "next/navigation";
import StoreSelect from "./StoreSelect";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/").filter(Boolean);
  const isSubPage = segments.length >= 2;

  const handleBack = () => {
    router.back();
  };

  const getPageTitle = () => {
    if (pathname.startsWith("/fulltimer")) return "정직원 급여명세서 정보";
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
            <h1>{getPageTitle()}</h1>
            <button className="btn-delete"></button>
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
