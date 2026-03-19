"use client";
import { useState } from "react";

export default function FindIdContents() {
  const [findCheck, setFindCheck] = useState(true);

  return (
    <div className="find-contents-wrap">
      {findCheck ? (
        <>
          <div className="find-header">
            <div className="find-header-tit">아이디 찾기</div>
            <div className="find-header-desc">회원정보에 등록된 이메일로 아이디를 찾을 수 있습니다.</div>
          </div>
          <div className="find-form">
            <div className="block mb8">
              <input type="text" className="input-frame" placeholder="Name" />
            </div>
            <div className="block">
              <input type="email" className="input-frame" placeholder="Email" />
            </div>
          </div>
          <div className="flex g8">
            <button className="btn-form l-grey block">취소</button>
            <button className="btn-form login block" onClick={() => setFindCheck(false)}>ID 찿기</button>
          </div>
        </>
      ):(
        <>
          <div className="find-header">
            <div className="find-header-tit">아이디 찿기 완료</div>
            <div className="find-header-desc">회원정보에 등록된 이메일로 아이디를 찾을 수 있습니다.</div>
          </div>
          <div className="id-info">
            <span>Interplug</span>님의 ID찾기가 완료 되었습니다.
          </div>
          <div className="find-form">
            <div className="block">
              <input type="email" className="input-frame" placeholder="Email" readOnly/>
            </div>
          </div>
          <div className="flex g8">
            <button className="btn-form l-grey block brd" onClick={() => setFindCheck(true)}>비밀번호 찿기</button>
            <button className="btn-form login block" >로그인</button>
          </div>
        </>
      )}
    </div>
  )
}