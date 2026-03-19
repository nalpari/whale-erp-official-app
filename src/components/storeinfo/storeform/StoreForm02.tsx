"use client";
import { usePopupControler } from "@/store/usePopupControler";

export default function StoreForm02() {
  const setAddressSearchPopup = usePopupControler(
    (state) => state.setAddressSearchPopup
  );
  return (
    <div className="sub-cont-wrap">
      <div className="sub-cont-item-wrap">
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              대표자<span className="imp"> *</span>
            </div>
            <div className="block">
              <input type="text" className="input-frame" />
            </div>
            <div className="warning mt10">대표자 입력</div>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              사업자등록번호<span className="imp"> *</span>
            </div>

            <div className="block">
              <input type="text" className="input-frame" />
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
              대표자 연락처<span className="imp"> *</span>
            </div>

            <div className="block">
              <input type="text" className="input-frame" />
            </div>
            <div className="s-txt mt10">※ 숫자만 입력 가능</div>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="tit-head">
              <div className="filed-tit">점포 전화번호</div>
            </div>
            <div className="block">
              <input type="text" className="input-frame" />
            </div>
            <div className="s-txt mt10">※ 숫자만 입력 가능</div>
          </div>
        </div>
      </div>
    </div>
  );
}
