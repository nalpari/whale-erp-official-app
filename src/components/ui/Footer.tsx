"use client";

import { useMenuStore } from "@/store/useMenuStore";
import { usePopupControler } from "@/store/usePopupControler";
import { usePathname, useRouter } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  // selector 패턴으로 필요한 상태만 구독
  const aiChatPopup = usePopupControler((state) => state.aiChatPopup);
  const setAiChatPopup = usePopupControler((state) => state.setAiChatPopup);
  const isMenuOpen = useMenuStore((state) => state.isMenuOpen);
  const toggleMenu = useMenuStore((state) => state.toggleMenu);
  const closeMenu = useMenuStore((state) => state.closeMenu);

  const segments = pathname.split("/").filter(Boolean);
  const isSubPage = segments.length >= 2;

  const handleHomeClick = () => {
    closeMenu();
    router.push("/");
  };

  const handleAiClick = () => {
    setAiChatPopup(true);
  };

  if (isSubPage) {
    return null;
  }

  if (pathname.includes("/list") || pathname.includes("/login") || pathname === "/changepw") {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <button
          className={`footer-item${aiChatPopup ? " act" : ""}`}
          onClick={handleAiClick}
        >
          <div className="item-icon ai"></div>
          <div className="item-text">AI</div>
        </button>
        <button
          className={`footer-item ${aiChatPopup || isMenuOpen ? " " : "act"}`}
          onClick={handleHomeClick}
        >
          <div className="item-icon home"></div>
          <div className="item-text">홈</div>
        </button>
        <button
          className={`footer-item${isMenuOpen ? " act" : ""}`}
          onClick={toggleMenu}
        >
          <div className="item-icon menu"></div>
          <div className="item-text">전체메뉴</div>
        </button>
      </div>
    </footer>
  );
}
