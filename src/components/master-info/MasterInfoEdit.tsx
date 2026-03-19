"use client";
import { usePopupControler } from "@/store/usePopupControler";
import Image from "next/image";

export default function MasterInfoEdit() {
  const setAddressSearchPopup = usePopupControler(
    (state) => state.setAddressSearchPopup
  );
  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    아이콘<span className="imp"> *</span>
                  </div>
                  <div className="avatar-wrap">
                    <button className="avatar-img">
                      <Image src="/assets/images/layout/avatar01.svg" alt="avatar" width={62} height={62} />
                    </button>
                    <button className="avatar-img act">
                      <Image src="/assets/images/layout/avatar02.svg" alt="avatar" width={62} height={62} />
                    </button>
                    <button className="avatar-img">
                      <Image src="/assets/images/layout/avatar03.svg" alt="avatar" width={62} height={62} />
                    </button>
                    <button className="avatar-img">
                      <Image src="/assets/images/layout/avatar04.svg" alt="avatar" width={62} height={62} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    대표자<span className="imp"> *</span>
                  </div>
                  <div className="block">
                    <input type="text" className="input-frame" defaultValue="홍길동" readOnly/>
                  </div>
                  <div className="warning mt10">대표자 입력</div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    브랜드 명<span className="imp"> *</span>
                  </div>
                  <div className="block">
                    <input type="text" className="input-frame" defaultValue="힘이나는 커피생활"/>
                  </div>
                  <div className="warning mt10">사업자등록번호 입력</div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    사업자등록번호<span className="imp"> *</span>
                  </div>
                  <div className="block">
                    <input type="text" className="input-frame" defaultValue="105-88-666666" readOnly/>
                  </div>
                  <div className="warning mt10">사업자등록번호 입력</div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    점포주소<span className="imp"> *</span>
                  </div>
                  <div className="block">
                    <div className="block mb8">
                      <button
                        className="btn-form block grey"
                        onClick={() => setAddressSearchPopup(true)}
                      >
                        주소찾기
                      </button>
                    </div>
                    <div className="block mb8">
                      <input type="text" className="input-frame" readOnly />
                    </div>
                    <div className="block">
                      <input
                        type="text"
                        className="input-frame"
                        placeholder="상세주소를 입력하세요."
                      />
                    </div>
                  </div>
                  <div className="warning mt10">점포주소 입력</div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    휴대폰 번호<span className="imp"> *</span>
                  </div>
                  <div className="block">
                    <input type="text" className="input-frame" placeholder="예) 01012345678"/>
                  </div>
                  <div className="s-txt mt10">※ 숫자만 입력 가능</div>
                  <div className="warning mt10">휴대폰 번호 입력</div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    이메일<span className="imp"> *</span>
                  </div>
                  <div className="block">
                    <input type="text" className="input-frame" />
                  </div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    영업분류<span className="imp"> *</span>
                  </div>
                  <div className="block">
                    <select name="" id="" className="select-form">
                      <option value="1"> 선택</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="tit-head">
                    <div className="filed-tit">
                      로고등록 <span className="imp"> *</span>
                    </div>
                  </div>
                  <div className="block mb10">
                    <div className="file-btn">
                      <input type="file" id="file-input" />
                      <label
                        className="btn-form block grey"
                        htmlFor="file-input"
                      >
                        <i className="file-icon"></i>
                        <span>파일찾기</span>
                      </label>
                    </div>
                  </div>
                  <div className="store-img-list">
                    <div className="store-img-bx">
                      <div className="store-img-tit">
                        <span className="img-tit">코튼크림 신메뉴_포스터</span>
                        <span>.png</span>
                      </div>
                      <div className="store-img-btn-wrap">
                        <button className="img-delete"></button>
                      </div>
                    </div>
                  </div>
                  <div className="filed-guide">
                    <span>
                      등록가능한 파일 문서파일(PDF), 이미지파일 (PNG,JPG, JPEG)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-pagination">
        <button className="btn-form block blue">저장하기</button>
      </div>
    </>
  );
}