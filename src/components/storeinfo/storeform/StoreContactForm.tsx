"use client";
import { usePopupControler } from "@/store/usePopupControler";
import { useStoreFormStore } from "@/store/useStoreFormStore";
import { isValidBusinessNumber, isValidPhoneNumber } from "@/lib/store-utils";

function formatBusinessNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  // 02 지역번호 (02-XXXX-XXXX 또는 02-XXX-XXXX)
  if (digits.startsWith("02")) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  // 010, 031 등 3자리 지역번호 (XXX-XXXX-XXXX 또는 XXX-XXX-XXXX)
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function StoreContactForm({ submitted = false }: { submitted?: boolean }) {
  const openAddressSearch = usePopupControler(
    (state) => state.openAddressSearch
  );
  const ceoName = useStoreFormStore((s) => s.ceoName);
  const businessNumber = useStoreFormStore((s) => s.businessNumber);
  const storeAddress = useStoreFormStore((s) => s.storeAddress);
  const storeAddressDetail = useStoreFormStore((s) => s.storeAddressDetail);
  const ceoPhone = useStoreFormStore((s) => s.ceoPhone);
  const storePhone = useStoreFormStore((s) => s.storePhone);
  const setField = useStoreFormStore((s) => s.setField);

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
            {submitted && !ceoName && (
              <div className="warning mt10">* 필수 입력 항목입니다.</div>
            )}
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
                onChange={(e) => setField("businessNumber", formatBusinessNumber(e.target.value))}
                placeholder="사업자등록번호를 입력하세요"
                maxLength={12}
                inputMode="numeric"
              />
            </div>
            {submitted && !businessNumber && (
              <div className="warning mt10">* 필수 입력 항목입니다.</div>
            )}
            {submitted && businessNumber && !isValidBusinessNumber(businessNumber) && (
              <div className="warning mt10">* 사업자등록번호 형식이 올바르지 않습니다.</div>
            )}
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
                  onClick={() => openAddressSearch((addr) => setField("storeAddress", addr))}
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
            {submitted && !storeAddress && (
              <div className="warning mt10">* 필수 입력 항목입니다.</div>
            )}
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
                onChange={(e) => setField("ceoPhone", formatPhoneNumber(e.target.value))}
                placeholder="연락처를 입력하세요"
                maxLength={13}
                inputMode="numeric"
              />
            </div>
            {submitted && !ceoPhone && (
              <div className="warning mt10">* 필수 입력 항목입니다.</div>
            )}
            {submitted && ceoPhone && !isValidPhoneNumber(ceoPhone) && (
              <div className="warning mt10">* 대표자 전화번호 형식이 올바르지 않습니다.</div>
            )}
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
                onChange={(e) => setField("storePhone", formatPhoneNumber(e.target.value))}
                placeholder="전화번호를 입력하세요"
                maxLength={13}
                inputMode="numeric"
              />
            </div>
            <div className="s-txt mt10">※ 숫자만 입력 가능</div>
          </div>
        </div>
      </div>
    </div>
  );
}
