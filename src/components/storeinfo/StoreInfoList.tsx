"use client";
import { useRouter } from "next/navigation";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";

export default function StoreInfoList() {
  const router = useRouter();
  const setStoreSearchSheet = useBottomSheetControler(
    (state) => state.setStoreSearchSheet
  );
  const dataLength = 4; // 데이터 개수 더미

  const handleSearchClick = () => {
    setStoreSearchSheet(true);
  };

  const handleItemClick = (index: number) => {
    router.push(`/storeinfo/${index}`);
  };

  return (
    <div className="container">
      <div className="sub-tit-wrap">
        <div className="sub-tit">점포정보 관리</div>
        <div className="sub-btn-wrap">
          <button
            className="btn-s black"
            onClick={() => router.push("/storeinfo/create")}
          >
            등록
          </button>
        </div>
      </div>
      <div className="sub-content-body">
        <div className="search-bx">
          <div className="search-count">
            검색결과 <span>128건</span>
          </div>
          <button className="search-btn act" onClick={handleSearchClick}>
            <i className="icon-search"></i>
            <span>검색</span>
          </button>
        </div>
        <div className="sub-cont-wrap">
          {Array.from({ length: dataLength }).map((_, index) => (
            <button
              className="sub-item-bx"
              key={index}
              onClick={() => handleItemClick(index)}
            >
              <div className="store-list-name">
                힘이나는커피생활 을지로3가점
              </div>
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "75px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>운영여부</th>
                    <td>
                      <span className="badge blue">운영</span>
                      <span className="badge red">미운영</span>
                    </td>
                  </tr>
                  <tr>
                    <th>본사</th>
                    <td>주식회사 따름인</td>
                  </tr>
                  <tr>
                    <th>가맹점</th>
                    <td>힘이나는커피생활 을지로3가점</td>
                  </tr>
                  <tr>
                    <th>등록일</th>
                    <td>2025.11.05</td>
                  </tr>
                </tbody>
              </table>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
