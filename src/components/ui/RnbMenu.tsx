"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useMenuStore } from "@/store/useMenuStore";
import { useRouter } from "next/navigation";

export default function RnbMenu() {
  const router = useRouter();
  const isMenuOpen = useMenuStore((state) => state.isMenuOpen);
  const closeMenu = useMenuStore((state) => state.closeMenu);

  useEffect(() => {
    if (isMenuOpen) {
      if (!document.body.classList.contains("open")) {
        document.body.classList.add("open");
      }
    } else {
      if (document.body.classList.contains("open")) {
        document.body.classList.remove("open");
      }
    }

    return () => {
      document.body.classList.remove("open");
    };
  }, [isMenuOpen]);

  const handleClick = () => {
    closeMenu();
  };

  return (
    <div className={`rnb-menu${isMenuOpen ? " act" : ""}`}>
      <div className="rnb-header-wrap">
        <div className="profile-wrap flex g12">
          <div className="profile-img">
            <Image
              src="/assets/images/layout/avatar01.svg"
              alt="profile-img"
              width={46}
              height={46}
            />
          </div>
          <div className="rnb-info">
            <p>
              <span>김지영(himmoo)</span>님
            </p>
            <p>환영 합니다.</p>
          </div>
        </div>
        <div className="block">
          <div className="block mb8">
            <button className="btn-form block blue" onClick={() => {router.push("/master-info"); closeMenu()}}>사업자정보 확인 및 수정</button>
          </div>
          <div className="block">
            <button className="btn-form block sky" onClick={() => {router.push("/changepw"); closeMenu()}}>비밀번호 변경</button>
          </div>
        </div>
      </div>
      <div className="rnb-menu-wrap">
          <dl className="rnb-menu-list">
            <dt className="rnb-menu-tit">점포관리</dt>
            <dd className="rnb-menu-item">
              <Link
                href="/storeinfo"
                className="rnb-menu-link"
                onClick={handleClick}
              >
                점포정보 관리
              </Link>
            </dd>
          </dl>
          <dl className="rnb-menu-list">
            <dt className="rnb-menu-tit">직원관리</dt>
            <dd className="rnb-menu-item">
              <Link href="/staff" className="rnb-menu-link" onClick={handleClick}>
                직원정보 관리
              </Link>
            </dd>
            <dd className="rnb-menu-item">
              <Link
                href="/contract"
                className="rnb-menu-link"
                onClick={handleClick}
              >
                근로계약관리
              </Link>
            </dd>
          </dl>
          <dl className="rnb-menu-list">
            <dt className="rnb-menu-tit">급여 명세서</dt>
            <dd className="rnb-menu-item">
              <Link
                href="/fulltimer"
                className="rnb-menu-link"
                onClick={handleClick}
              >
                정직원 급여 명세서
              </Link>
            </dd>
            <dd className="rnb-menu-item">
              <Link
                href="/parttimer"
                className="rnb-menu-link"
                onClick={handleClick}
              >
                파트타이머 급여 명세서
              </Link>
            </dd>
            <dd className="rnb-menu-item">
              <Link
                href="/overtime"
                className="rnb-menu-link"
                onClick={handleClick}
              >
                연장근무 수당 명세서
              </Link>
            </dd>
          </dl>
          <dl className="rnb-menu-list">
            <dt className="rnb-menu-tit">근무현황</dt>
            <dd className="rnb-menu-item">
              <Link
                href="/commute"
                className="rnb-menu-link"
                onClick={handleClick}
              >
                출퇴근현황
              </Link>
            </dd>
            <dd className="rnb-menu-item">
              <Link href="/plan" className="rnb-menu-link" onClick={handleClick}>
                점포별 근무 계획표
              </Link>
            </dd>
          </dl>
          <div className="rnb-menu-list">
            <button className="logout-btn">로그아웃</button>
          </div>
      </div>
    </div>
  );
}
