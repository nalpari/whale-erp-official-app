"use client";
import { useState } from "react";

export default function ChangePassword() {
  const [showPw, setShowPw] = useState(false);

  return (
  <div className="find-contents-wrap">
    <div className="find-header">
      <div className="find-header-tit">비밀번호 변경</div>
      <div className="find-header-desc">현재 비밀번호를 확인 후 새로운 비밀번호로 변경할 수 있습니다.</div>
    </div>
    <div className="find-form">
      <div className="data-filed">
        <div className="filed-tit">
        현재 비밀번호 <span className="imp">*</span>
        </div>
        <div className="block">
          <div className="input-icon-frame">
            <input
              type={showPw ? "text" : "password"}
              placeholder="8자 이상 영문과 숫자 조합으로 입력해 주세요"
            />
            <button
              type="button"
              className={`input-icon-btn ${showPw ? "show" : "hide"}`}
              onClick={() => setShowPw(!showPw)}
            ></button>
          </div>
        </div>
        <div className="warning mt5">현재 비밀번호가 일치하지 않습니다.</div>
      </div>
      <div className="data-filed">
        <div className="filed-tit">
        신규 비밀번호 <span className="imp">*</span>
        </div>
        <div className="block">
          <div className="input-icon-frame">
            <input
              type={showPw ? "text" : "password"}
              placeholder="8자 이상 영문과 숫자 조합으로 입력해 주세요"
            />
            <button
              type="button"
              className={`input-icon-btn ${showPw ? "show" : "hide"}`}
              onClick={() => setShowPw(!showPw)}
            ></button>
          </div>
        </div>
        <div className="warning mt5">비밀번호가 일치하지 않습니다.</div>
      </div>
      <div className="data-filed">
        <div className="filed-tit">
        비밀번호 확인 <span className="imp">*</span>
        </div>
        <div className="block">
          <div className="input-icon-frame">
            <input
              type={showPw ? "text" : "password"}
              placeholder="8자 이상 영문과 숫자 조합으로 입력해 주세요"
            />
            <button
              type="button"
              className={`input-icon-btn ${showPw ? "show" : "hide"}`}
              onClick={() => setShowPw(!showPw)}
            ></button>
          </div>
        </div>
        <div className="warning mt5">비밀번호가 일치하지 않습니다.</div>
      </div>
    </div>
    <div className="flex g8">
      <button className="btn-form l-grey block brd">취소</button>
      <button className="btn-form login block">저장</button>
    </div>
  </div>
  );
}