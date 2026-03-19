"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CommuteList() {
  const router = useRouter();
  const setCommuteSearchSheet = useBottomSheetControler(
    (state) => state.setCommuteSearchSheet
  );
  return (
    <div className="container">
      <div className="sub-tit-wrap ">
        <div className="sub-tit">출퇴근 현황</div>
      </div>
      <div className="sub-content-body">
        <div className="search-bx staff">
          <div className="search-count">
            검색결과 <span>128건</span>
          </div>
          <button
            className="search-btn act"
            onClick={() => setCommuteSearchSheet(true)}
          >
            <i className="icon-search"></i>
            <span>검색</span>
          </button>
        </div>
        <div className="staff-list-wrap">
          <div className="staff-list-item">
            <div className="staff-item-header">
              <div className="head-staff-info">
                <div className="staff-icon">
                  <Image
                    src="/assets/images/layout/avatar01.svg"
                    alt="staff-icon"
                    width={46}
                    height={46}
                  />
                </div>
                <div className="staff-info-data">
                  <div className="staff-name">
                    <span>김길수</span>
                  </div>
                  <div className="staff-job">파트타이머/토,일요일/근무</div>
                </div>
              </div>
            </div>
            <button
              className="sub-item-bx "
              onClick={() => router.push("/commute/1")}
            >
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "90px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>계약분류</th>
                    <td>파트타이머</td>
                  </tr>
                  <tr>
                    <th>본사</th>
                    <td>주식회사 따름인</td>
                  </tr>
                  <tr>
                    <th>가맹점</th>
                    <td>
                      <div className="ellipsis">
                        힘이나는커피생활 을지로3가점
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>점포</th>
                    <td>
                      <div className="ellipsis">
                        힘이나는커피생활 을지로3가점
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </button>
          </div>
          <div className="staff-list-item">
            <div className="staff-item-header">
              <div className="head-staff-info">
                <div className="staff-icon">
                  <Image
                    src="/assets/images/layout/avatar02.svg"
                    alt="staff-icon"
                    width={46}
                    height={46}
                  />
                </div>
                <div className="staff-info-data">
                  <div className="staff-name">
                    <span>홍길동</span>
                  </div>
                  <div className="staff-job">파트타이머/토,일요일/근무</div>
                </div>
              </div>
            </div>
            <button
              className="sub-item-bx "
              onClick={() => router.push("/commute/1")}
            >
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "90px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>계약분류</th>
                    <td>파트타이머</td>
                  </tr>
                  <tr>
                    <th>본사</th>
                    <td>주식회사 따름인</td>
                  </tr>
                  <tr>
                    <th>가맹점</th>
                    <td>
                      <div className="ellipsis">
                        힘이나는커피생활 을지로3가점
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>점포</th>
                    <td>
                      <div className="ellipsis">
                        힘이나는커피생활 을지로3가점
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </button>
          </div>
          <div className="staff-list-item">
            <div className="staff-item-header">
              <div className="head-staff-info">
                <div className="staff-icon">
                  <Image
                    src="/assets/images/layout/avatar03.svg"
                    alt="staff-icon"
                    width={46}
                    height={46}
                  />
                </div>
                <div className="staff-info-data">
                  <div className="staff-name">
                    <span>김민수</span>
                  </div>
                  <div className="staff-job">파트타이머/토,일요일/근무</div>
                </div>
              </div>
            </div>
            <button
              className="sub-item-bx "
              onClick={() => router.push("/commute/1")}
            >
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "90px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>계약분류</th>
                    <td>파트타이머</td>
                  </tr>
                  <tr>
                    <th>본사</th>
                    <td>주식회사 따름인</td>
                  </tr>
                  <tr>
                    <th>가맹점</th>
                    <td>
                      <div className="ellipsis">
                        힘이나는커피생활 을지로3가점
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>점포</th>
                    <td>
                      <div className="ellipsis">
                        힘이나는커피생활 을지로3가점
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
