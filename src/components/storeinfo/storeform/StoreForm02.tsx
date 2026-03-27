"use client";
import { usePopupControler } from "@/store/usePopupControler";
import { useStoreFormStore } from "@/store/useStoreFormStore";

export default function StoreForm02() {
  const setAddressSearchPopup = usePopupControler(
    (state) => state.setAddressSearchPopup
  );
  const {
    ceoName, businessNumber, storeAddress, storeAddressDetail, ceoPhone, storePhone,
    setField,
  } = useStoreFormStore();

  return (
    <div className="sub-cont-wrap">
      <div className="sub-cont-item-wrap">
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              대표자<span className="imp"> *</span>
            </div>
            <div className="block">
              <input
                type="text"
                className="input-frame"
                value={ceoName}
                onChange={(e) => setField("ceoName", e.target.value)}
                placeholder="대표자명을 입력하세요"
              />
            </div>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              사업자등록번호<span className="imp"> *</span>
            </div>
            <div className="block">
              <input
                type="text"
                className="input-frame"
                value={businessNumber}
                onChange={(e) => setField("businessNumber", e.target.value)}
                placeholder="사업자등록번호를 입력하세요"
              />
            </div>
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
                <input
                  type="text"
                  className="input-frame"
                  value={storeAddress}
                  readOnly
                  placeholder="기본 주소"
                />
              </div>
              <div className="block">
                <input
                  type="text"
                  className="input-frame"
                  value={storeAddressDetail}
                  onChange={(e) => setField("storeAddressDetail", e.target.value)}
                  placeholder="상세주소를 입력하세요."
                />
              </div>
            </div>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              대표자 연락처<span className="imp"> *</span>
            </div>
            <div className="block">
              <input
                type="text"
                className="input-frame"
                value={ceoPhone}
                onChange={(e) => setField("ceoPhone", e.target.value.replace(/[^0-9-]/g, ""))}
                placeholder="연락처를 입력하세요"
              />
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
              <input
                type="text"
                className="input-frame"
                value={storePhone}
                onChange={(e) => setField("storePhone", e.target.value.replace(/[^0-9-]/g, ""))}
                placeholder="전화번호를 입력하세요"
              />
            </div>
            <div className="s-txt mt10">※ 숫자만 입력 가능</div>
          </div>
        </div>
      </div>
    </div>
  );
}
