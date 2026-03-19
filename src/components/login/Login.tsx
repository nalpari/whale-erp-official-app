"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const router = useRouter();
  return (
    <div className="login-wrap">
      <div className="login-logo-wrap">
        <div className="login-logo">
          <Image
            src="/assets/images/layout/login_logo.svg"
            alt="logo"
            width={60}
            height={60}
          />
        </div>
        <div className="logo-app-name">
          <span>WHALE ERP</span>
          <span>PARTNER OFFICE</span>
        </div>
      </div>
      <div className="login-form-wrap">
        <div className="form-tit">All in One 점포관리 플랫폼</div>
        <div className="login-form">
          <div className="id-form">
            <input type="text" className="input-frame" placeholder="ID" />
          </div>
          <div className="pw-form">
            <div className="input-icon-frame">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Password"
              />
              <button
                type="button"
                className={`input-icon-btn ${showPw ? "show" : "hide"}`}
                onClick={() => setShowPw(!showPw)}
              ></button>
            </div>
          </div>
          <div className="login-btn">
            <button
              className="btn-form login block"
              onClick={() => router.push("/")}
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>
      <div className="login-form-check-wrap">
        <div className="toggle-wrap">
          <div className="toggle-btn">
            <input type="checkbox" id="toggle-btn" />
            <label className="slider" htmlFor="toggle-btn">
              자동 로그인
            </label>
          </div>
        </div>
        <div className="auto-right">
          <div className="find-id-wrap">
            <button className="find-id-btn" onClick={() => router.push("/login/findid")}>ID 찾기</button>
            <button className="find-id-btn" onClick={() => router.push("/login/findpw")}>비밀번호 찾기</button>
          </div>
        </div>
      </div>
      <div className="another-login-wrap">
        <div className="another-login-tit">다른 로그인 방법</div>
        <div className="another-login-list">
          <button className="btn-form outline-g block">
            <i className="kakao"></i>
            <span>카카오 계정으로 회원 등록 </span>
          </button>
          <button className="btn-form outline-g block">
            <i className="naver"></i>
            <span>네이버 계정으로 회원 등록 </span>
          </button>
          <button className="btn-form outline-g block">
            <i className="google"></i>
            <span>구글 계정으로 회원 등록 </span>
          </button>
        </div>
      </div>
      <div className="login-guide">
        <span>보서비스는 RP마시터계정 부는 까EAOT?</span>
        <span>로그인 권한이 부여된 직원만 이용할 수 있습니다.</span>
        <span>
          직원은 <b>직원용 APP 계정</b>으로 로그인하며, 카카오, 네이버, 구굴
          간편 로그인을 지원합니다.
        </span>
      </div>
    </div>
  );
}
