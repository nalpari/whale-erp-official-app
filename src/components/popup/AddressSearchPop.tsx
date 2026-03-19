import { usePopupControler } from "@/store/usePopupControler";
import { useEffect, useState } from "react";

export default function AddressSearchPop() {
  const [active, setActive] = useState(false);
  const addressSearchPopup = usePopupControler(
    (state) => state.addressSearchPopup
  );
  const setAddressSearchPopup = usePopupControler(
    (state) => state.setAddressSearchPopup
  );

  const dataLengthDummy = 0; // 검색 결과 건수

  useEffect(() => {
    // 팝업 열기 시간 필요
    const timer = setTimeout(() => {
      setActive(addressSearchPopup);
    }, 100);

    return () => clearTimeout(timer);
  }, [addressSearchPopup]);

  // 팝업 닫기 시간 필요
  const handleClose = () => {
    setActive(false);
    setTimeout(() => {
      setAddressSearchPopup(false);
    }, 250);
  };

  return (
    <div className={`modal-popup ${active ? "act" : ""}`}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3>주소검색</h3>
            <button className="modal-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="back-frame">
              <div className="address-search">
                <div className="input-icon-frame">
                  <input type="text" />
                  <button
                    type="button"
                    className="input-icon-btn search-del"
                  ></button>
                  <button
                    type="button"
                    className="input-icon-btn search"
                  ></button>
                </div>
                {dataLengthDummy <= 0 && (
                  <div className="warning mt15">검색 결과가 없습니다.</div>
                )}
              </div>
              {dataLengthDummy > 0 ? (
                <div className="address-list-wrap">
                  <div className="address-count">
                    검색결과 <span>28</span>건
                  </div>
                  <ul className="address-list">
                    {Array.from({ length: dataLengthDummy }).map((_, index) => (
                      <li className="address-item" key={index}>
                        <button className="address-item-btn">
                          <div className="address-tit">현대백화점 판교점</div>
                          <div className="address-addr">
                            [주소] 경기 성남시 분당구 판교역로 146번길 20
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="address-list-wrap">
                  <div className="address-list-empty-tit">
                    <span className="tip-badge">TIP</span>
                    <span>이렇게 검색해 보세요.</span>
                  </div>
                  <div className="address-example-list">
                    <div className="address-example-item">
                      <div className="address-example-item-tit">
                        도로명+건물번호
                      </div>
                      <div className="address-example-item-addr">
                        예) 판교역로166
                      </div>
                    </div>
                    <div className="address-example-item">
                      <div className="address-example-item-tit">
                        지역명(동/리)+번지물번호
                      </div>
                      <div className="address-example-item-addr">
                        예) 백현동 532
                      </div>
                    </div>
                    <div className="address-example-item">
                      <div className="address-example-item-tit">
                        지역명(동/리)+건물명(아파트명)
                      </div>
                      <div className="address-example-item-addr">
                        예) 분당 주공, 연수동 주공 3차
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
